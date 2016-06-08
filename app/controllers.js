"use strict";

const getScreenMedia    = require('getscreenmedia');
const PeerConnection    = require('rtcpeerconnection');
const attachMediaStream = require('attachmediastream');

const helpersControllers = angular.module('helpersControllers', []);

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
    const config = {
      'iceServers': [{
        'url': 'stun:stun.l.google.com:19305'
      }]
    };

    const pc = new PeerConnection(config);
    getScreenMedia(function (err, stream) {
      if (err) {
        console.log(err);
      } else {
        attachMediaStream(stream, document.getElementById('video'));
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

  $scope.submit = function() {
  if ($scope.text) {
      let message = {from: 'You', text: $scope.text};
      socket.emit('chat:message', message);
      $scope.messages.push(message);
      $scope.text = '';
    }
  };
}]);
