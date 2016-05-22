"use strict";

const helpersControllers = angular.module('helpersControllers', []);

helpersControllers.controller('QuestionCtrl', ['$scope', 'Question', function ($scope, Question) {
  $scope.orderProp = 'age';
  $scope.questions = Question.query();

  $scope.submitQuestion = function() {
    if ($scope.questionText) {
      $scope.question = new Question({text: $scope.questionText});
      $scope.question.text = $scope.questionText;
      $scope.question.$save(function() {
        $scope.questionText = null;
        $scope.questions = Question.query();
      });
    }
  };
}]);

helpersControllers.controller('SessionCtrl', ['$scope', '$location', 'socket', 'question', function ($scope, $location, socket, question) {
  $scope.question = question;
  $scope.messages = [];

  socket.emit('question:join', $scope.question.id);

  socket.on('chat:message', function(message) {
      $scope.messages.push(message);
  });

  $scope.submit = function() {
  if ($scope.text) {
      let message = {from: 0, text: $scope.text};
      socket.emit('chat:message', message);
      $scope.messages.push(message);
      $scope.text = '';
    }
  };
}]);
