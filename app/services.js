"use strict";

const helpersServices = angular.module('helpersServices', ['ngResource']);

helpersServices.factory('Question', ['$resource', function($resource) {
  return $resource('/questions', {}, {
    query: { method: 'GET', params: {}, isArray: true }
  });
}]);

helpersServices.factory('socket', function($rootScope) {
  let socket = io.connect();

  return {
    on: function(eventName, callback) {
      socket.on(eventName, function() {
        let args = arguments;
        $rootScope.$apply(function() {
          callback.apply(socket, args);
        });
      });
    },

    emit: function(eventName, data, callback) {
      socket.emit(eventName, data, function() {
        let args = arguments;
        $rootScope.apply(function() {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
