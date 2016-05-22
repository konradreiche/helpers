"use strict";

const helpersHQ = angular.module('helpersHQ', ['ngRoute', 'helpersControllers', 'helpersServices']);

helpersHQ.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/questions', {
    templateUrl: 'partials/questions.html',
    controller: 'QuestionCtrl'
  })
  .when('/questions/:questionId', {
    templateUrl: 'partials/session.html',
    controller: 'SessionCtrl',
    resolve: {
      question: function($route, Question) {
        return Question.get({questionId: $route.current.params.questionId});
      }
    }
  })
  .otherwise({
    redirectTo: '/questions'
  });
}]);

