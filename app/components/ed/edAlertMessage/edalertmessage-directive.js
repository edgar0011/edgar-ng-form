angular.module("ed.ui.directives")

/**
 * @ngdoc directive
 * @name ed.ui.directives.directive:edAlertMessage
 * @element div
 * @restrict EA
 *
 * @description
 * Listens to messageEvent and shows message, using bootstrap alert classes, type relevant to errorLevel
 * @see edAlertMessageConstants.MESSAGE_EVT:messageEvent
 */
.directive('edAlertMessage', function($timeout, edAlertMessageConstants, edMessageBus) {

        return {
            templateUrl: "components/ed/edAlertMessage/edalertmessage.html",
            restrict: 'EA',
            link: function(scope) {
                var timeoutPromise;
                edMessageBus.on(edAlertMessageConstants.MESSAGE_EVT, function(event, payLoad) {

                    var message = payLoad.message;
                    var errorLevel = payLoad.errorLevel;
                    var context = payLoad.context;

                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = null;

                    scope.message = message;
                    if (!angular.isString(message) && scope.errorLevel === errorLevel && scope.context === context) {
                        return;
                    }
                    scope.context = context;
                    scope.errorLevel = errorLevel;

                    var styles = ['alert-danger', 'alert-warning', 'alert-success'];
                    errorLevel = Number(errorLevel);
                    if (isNaN(errorLevel) || errorLevel < 0 || errorLevel > styles.length - 1) {
                        errorLevel = 0;
                    }
                    scope.style = styles[errorLevel];

                    timeoutPromise = $timeout(function() {
                        scope.message = null;
                    }, 5000);
                });

                scope.hide = function() {
                    $timeout.cancel(timeoutPromise);

                    timeoutPromise = null;
                    scope.message = null;
                };
            }
        };
    })
    .factory("emitEdAlertMessage", function(edMessageBus, edCoreConstants, edAlertMessageConstants) {

        return function(text, priority, context) {
            context = context || edCoreConstants.errorMessageContexts.ROUTE;
            priority = isNaN(priority) ? 2 : priority;
            edMessageBus.emit(
                edAlertMessageConstants.MESSAGE_EVT, {
                    message: text,
                    errorLevel: priority,
                    context: context
                }
            );
        };

    });
