var module = angular.module('ed.messaging', ['ed.events'])

.factory("edMessageBus", function($rootScope, edEventBus) {
    'use strict';
    var edMessageBusInstance = {

        emit: function(eventName, payLoad) {
            edEventBus.emit(eventName, payLoad, $rootScope);
        },
        on: function(eventName, func) {
            edEventBus.on(eventName, func, $rootScope);
        },
        off: function(eventName, func) {
            edEventBus.off(eventName, func, $rootScope);
        }
    };
    return edMessageBusInstance;
});
