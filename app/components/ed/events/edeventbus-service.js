var module = angular.module('ed.events', [])

.factory("edEventBus", function($rootScope) {
    'use strict';

    function assertListenerArgs(eventName, func) {
        if (!angular.isString(eventName) || !angular.isFunction(func)) {
            return false;
        }
        return true;
    }

    function assertDispatchArgs(eventName) {
        return angular.isString(eventName);
    }

    var _listeners = {};

    function addListener(token, func, offFunc) {
        if (!angular.isArray(_listeners[token])) {
            _listeners[token] = [{
                listener: func,
                offFunction: offFunc
            }];
        } else {
            _listeners[token].push({
                listener: func,
                offFunction: offFunc
            });
        }
    }

    function removeListener(token, func) {
        if (!angular.isArray(_listeners[token])) {
            var l = _listeners[token].length;
            while (l--) {
                if (_listeners[token][l].listener === func) {
                    var off = _listeners[token][l].offFunction;
                    _listeners[token].splice(l, 1);
                    if (!_listeners[token].length) {
                        delete _listeners[token];
                    }
                    return off;
                }
            }

        }
    }

    var edMessageBusInstance = {
        broadcast: function(eventName, payLoad, scope) {
            if (!assertDispatchArgs(eventName)) {
                return;
            }
            scope = scope || $rootScope;
            scope.$broadcast(eventName, payLoad);
        },
        emit: function(eventName, payLoad, scope) {
            if (!assertDispatchArgs(eventName)) {
                return;
            }
            scope = scope || $rootScope;
            scope.$emit(eventName, payLoad);
        },
        on: function(eventName, func, scope) {
            if (!assertListenerArgs(eventName, func)) {
                return;
            }
            scope = scope || $rootScope;
            var token = scope.$id + eventName;
            var f = scope.$on(eventName, func);

            addListener(token, func, f);

            scope.$on('$destroy', function(event, data) {
                edMessageBusInstance.off(eventName, func, scope);
            });

        },
        off: function(eventName, func, scope) {
            if (!assertListenerArgs(eventName, func)) {
                return;
            }

            var token = scope.$id + eventName;

            var f = removeListener(token, func);
            if (angular.isFunction(f)) {
                f();
            }

        }
    };
    return edMessageBusInstance;
});
