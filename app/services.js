"use strict";

const helpersServices = angular.module('helpersServices', ['ngResource']);

helpersServices.factory('Question', ['$resource', function($resource) {
  return $resource('/questions', {}, {
    query: { method: 'GET', params: {}, isArray: true }
  });
}]);
