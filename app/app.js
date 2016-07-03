"use strict";

const helpersHQ = angular.module('helpersHQ', ['ngRoute', 'ngAnimate', 'helpersControllers', 'helpersServices']);

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
      },
      messages: function($route, Message) {
        return Message.query({questionId: $route.current.params.questionId});
      }
    }
  })
  .when('/questions/:questionId/answer', {
    templateUrl: 'partials/session.html',
    controller: 'AnswerCtrl',
    resolve: {
      question: function($route, Question) {
        return Question.get({questionId: $route.current.params.questionId});
      },
      messages: function($route, Message) {
        return Message.query({questionId: $route.current.params.questionId});
      }
    }
  })
  .otherwise({
    redirectTo: '/questions'
  });
}]);

