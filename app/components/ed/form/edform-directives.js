angular.module("ed.ui.directives")

.directive('edClickOutside', function($log, $document) {
    return function(scope, element, attrs) {
        var documentClickHandler = function(event) {
            var path = [event.target];
            var parentElement = event.target.parentElement;
            while (parentElement) {
                path.push(parentElement);
                parentElement = parentElement.parentElement;
            }
            if (path.indexOf(element[0]) == -1) {
                scope.$apply(attrs.clickOutside);
            }
        };
        angular.element($document).on("click", documentClickHandler);
        scope.$on("$destroy", function() {
            angular.element($document).off("click", documentClickHandler);
        });
    };
})

.directive('edAutoFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function(scope, element) {
            $timeout(function() {
                element[0].focus();
            }, 0, false);
        }
    };
})

.directive('edDoFocus', function doFocus($timeout, $parse) {
    return function(scope, element, attrs) {
        //getter
        var model = $parse(attrs.edDoFocus);

        scope.$watch(model, function(newVal) {
            if (newVal === true || newVal === 'true') {
                $timeout(function() {
                    element[0].focus();
                }, 0, false);
            }
        });

        if (model.assign) {
            element.on('focus', function() {
                //setter
                scope.$apply(model.assign(scope, true));
            });
            element.on('blur', function() {
                //setter
                scope.$apply(model.assign(scope, false));
            });
        }
    };
})

.directive('edEscapeHandler', function() {
    var ESCAPE_KEY = 27;
    return function(scope, element, attrs) {
        element.on('keydown', function(event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.edEscapeHandler);
            }
        });
    };
})

.directive('edEditProtect', function() {
    return function(scope, element, attrs) {
        element.on('keydown cut copy paste', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        });
    };
})

.directive('edPasteProtect', function() {
    return function(scope, element, attrs) {
        element.on('cut copy paste', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        });
    };
})

.directive('edSelectOnClick', function() {
    return function(scope, element, attrs) {
        element.on('click', function() {
            this.select();
        });
    };
})

.directive('edMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            /*scope.$watch(attr.ngMin, function(newValue) {

                var value = ctrl.$viewValue;
                validate(value);
                console.log("ngMin watched: " + scope.$eval(attr.ngMin) + ", value: " + value);

            });*/

            attr.$observe('edMin', function() {
                var value = ctrl.$viewValue;
                validate(value);
                console.log("edMin observed: " + scope.$eval(attr.edMin) + ", value: " + value);
            });

            var minValidator = function(value) {
                return validate(value);
            };

            function validate(value) {
                var min = scope.$eval(attr.edMin) || 0;
                if (angular.isNumber(value) && value < min) {
                    //ctrl.$setValidity('ngMin', false);
                    ctrl.$setValidity('min', false);
                    return undefined;
                } else {
                    //ctrl.$setValidity('ngMin', true);
                    ctrl.$setValidity('min', true);
                    return value;
                }
            }

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
})

.directive('edMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {

            /*scope.$watch(attr.ngMax, function(newValue) {

                var value = ctrl.$viewValue;
                validate(value);
                console.log("ngMax watched: " + scope.$eval(attr.ngMax) + ", value: " + value);

            });*/

            attr.$observe('edMax', function() {
                var value = ctrl.$viewValue;
                validate(value);
                console.log("edMax observed: " + scope.$eval(attr.edMax) + ", value: " + value);
            });

            var maxValidator = function(value) {
                return validate(value);
            };

            function validate(value) {
                var max = scope.$eval(attr.edMax) || Infinity;
                if (angular.isNumber(value) && value > max) {
                    //ctrl.$setValidity('ngMax', false);
                    ctrl.$setValidity('max', false);
                    return undefined;
                } else {
                    //ctrl.$setValidity('ngMax', true);
                    ctrl.$setValidity('max', true);
                    return value;
                }
            }

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});
