"use strict";

const helpersControllers = angular.module('helpersControllers', []);

helpersControllers.controller('QuestionCtrl', ['$scope', '$location', '$http', 'Question', function ($scope, $location, $http, Question) {
  $scope.orderProp = 'age';
  $scope.questions = Question.query();

  $scope.submitQuestion = function() {
    if ($scope.questionText) {
      $scope.question = new Question({text: $scope.questionText});
      $scope.question.text = $scope.questionText;
      $scope.question.$save(function(question) {
        $scope.questionText = null;
        $scope.questions = Question.query();
        $location.path(`/questions/${question.id}`);
      });
    }
  };

  $scope.answerQuestion = function(id) {
    $http.post(`/questions/${id}/answer`, {id: id});
  };
}]);

helpersControllers.controller('SessionCtrl', ['$scope', '$location', 'socket', 'question', 'messages',
                              function ($scope, $location, socket, question, messages) {
  $scope.question = question;
  $scope.messages = messages;

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

helpersControllers.controller('AnswerCtrl', ['$scope', function ($scope) {

}]);
