"use strict";

const getScreenMedia    = require('getscreenmedia');
const PeerConnection    = require('rtcpeerconnection');
const attachMediaStream = require('attachmediastream');

const helpersControllers = angular.module('helpersControllers', []);

const config = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19305'
  }]
};


helpersControllers.controller('QuestionCtrl', ['$scope', '$route', '$location', '$http', 'Question', function ($scope, $route, $location, $http, Question) {
  $scope.orderProp = 'age';
  $scope.questions = Question.query();

  $scope.submitQuestion = function() {
    if ($scope.questionText) {
      $scope.question = new Question({text: $scope.questionText});
      $scope.question.text = $scope.questionText;
      $scope.question.$save(function(question) {
        $scope.questionText = null;
        $scope.questions = Question.query();
        $route.current.type = 'helper';
        $location.path(`/questions/${question.id}`);
      });
    }
  };

  $scope.answerQuestion = function(id) {
    $http.post(`/questions/${id}/answer`, {id: id});
  };
}]);

helpersControllers.controller('SessionCtrl', ['$scope', '$route', '$location', 'socket', 'question', 'messages',
                              function ($scope, $route, $location, socket, question, messages) {
  $scope.question = question;
  $scope.messages = messages;

  socket.emit('question:join', $scope.question.id);

  socket.on('chat:message', function(message) {
      $scope.messages.push(message);
  });

  $scope.shareScreen = function() {
    const pc = new PeerConnection(config);
    getScreenMedia(function (err, stream) {
      if (err) {
        console.log(err);
      } else {
        attachMediaStream(stream, document.getElementById('video'));
        console.log("Adding stream to peer connection");
        pc.addStream(stream);

        console.log("Creating an offer for peer conncetion");
        pc.offer({mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: false
        }}, function (err, offer) {
          if (!err) {
            socket.emit("offer", offer);
          } else {
            console.log(err);
          }
        });

        pc.on('ice', function(candidate) {
          console.log("Received ICE candidate");
          socket.emit('candidate', candidate);
        });

        socket.on('candidate', function(candidate) {
          console.log('Recieved an ICE candidate');
          pc.processIce(candidate);
        });

        socket.on('answer', function(answer) {
          pc.handleAnswer(answer);
        });

        pc.on('close', function() {
          console.log('Peer connection closed');
        });
      }
   });
  };

  $scope.submit = function() {
  if ($scope.text) {
      let message = {from: 'You', text: $scope.text};
      socket.emit('chat:message', message);
      $scope.messages.push(message);
      $scope.text = '';
    }
  };
}]);

helpersControllers.controller('AnswerCtrl', ['$scope', '$route', '$location', 'socket', 'question', 'messages',
                              function ($scope, $route, $location, socket, question, messages) {

  $scope.question = question;
  $scope.messages = messages;
  $scope.helper = true;

  socket.emit('question:join', $scope.question.id);

  socket.on('chat:message', function(message) {
      $scope.messages.push(message);
  });


  const pc = new PeerConnection(config);
  socket.on('offer', function(offer) {
    console.log("Received an offer");
    pc.handleOffer(offer, function(err) {
      console.log("Answer offer with jingle");
      pc.answer(function(err, answer) {
        if (err) {
          console.log(err);
        } else {
          answer.jingle = offer.jingle;
          socket.emit('answer', answer);
        }
      });
    });
  });

  socket.on('candidate', function(candidate) {
    console.log('Recieved an ICE candidate');
    pc.processIce(candidate);
  });

  pc.on('ice', function(candidate) {
    socket.emit('candidate', candidate);
  });

  pc.on('addStream', function(event) {
      attachMediaStream(event.stream, document.getElementById('video'));
  });

  $scope.submit = function() {
  if ($scope.text) {
      let message = {from: 'You', text: $scope.text};
      socket.emit('chat:message', message);
      $scope.messages.push(message);
      $scope.text = '';
    }
  };
}]);
