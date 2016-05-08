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
