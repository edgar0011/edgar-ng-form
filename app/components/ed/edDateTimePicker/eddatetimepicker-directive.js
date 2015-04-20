angular.module("ed.ui.directives")

//inital date format workaround (issue w/ angular 1.3.0
//https://github.com/angular-ui/bootstrap/issues/2659
.directive('datepickerPopup', function() {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    };
})

.directive("edDateTimePicker", function($parse) {

    return {

        scope: {
            format: '@',
            dateFrom: "=",
            dateTo: "=",
            minDate: "="
        },

        /*require: "ngModel",*/
        templateUrl: "components/ed/edDateTimePicker/eddatetimepicker.html",

        link: function(scope, element, attrs, ngModelController) {

            //scope.date = scope.dateFrom = scope.dateTo = scope.$parent.$eval(attrs.ngModel);
            scope.date = scope.dateFrom;

            if (!scope.minDate) {
                scope.minDate = new Date();
            }
            //scope.date = scope.dateFrom;
            //scope.date = scope.$parent.$eval(attrs.dateFrom);

            //scope.minDate = scope.$parent.$eval(attrs.minDate);

            var inputElement = element.find("input");

            scope.$watch(function() {

                return scope.date + scope.dateFrom + scope.dateTo;

            }, function(newVal, oldVal) {

                if (newVal === oldVal) {
                    return;
                }

                scope.$evalAsync(function() {

                    validateDateTo();

                    commitValue();

                });
            });

            /*scope.$watch(function() {

                return scope.dateFrom + scope.dateTo;

            }, function(newVal, oldVal) {

                if (newVal === oldVal) {
                    return;
                }

                scope.$evalAsync(function() {

                    validateDateTo();

                    commitValue();

                });
            });*/

            function validateDateTo() {

                if (!scope.dateFrom || !scope.dateTo) {
                    return;
                }

                var timeFrom = scope.dateFrom.getTime();

                var timeTo = scope.dateTo.getTime();

                if (timeTo - timeFrom < 30 * 60 * 1000) {
                    scope.dateTo.setTime(scope.dateFrom.getTime() + 30 * 60 * 1000);

                    scope.dateTo = angular.copy(scope.dateTo);
                }
            }

            function commitValue() {

                if (!scope.dateFrom || !scope.dateTo) {
                    return;
                }

                if (!scope.date.isAfter(scope.minDate)) {
                    scope.date = scope.minDate;
                    return;
                }

                scope.date.setHours(scope.dateFrom.getHours());
                scope.date.setMinutes(scope.dateFrom.getMinutes());

                var date2 = new Date(scope.date.getTime());
                date2.setHours(scope.dateTo.getHours());
                date2.setMinutes(scope.dateTo.getMinutes());

                scope.$eval(attrs.dateFrom + "=scope.date");
                scope.$eval(attrs.dateTo + "=date2");

                scope.dateFrom = scope.date;
                scope.dateTo = date2;

                /*var getter = $parse('dateFrom');
                var setter = getter.assign;
                setter(scope, scope.date);

                getter = $parse('dateTo');
                setter = getter.assign;
                setter(scope, date2);*/

                //ngModelController.$setViewValue(scope.date);
            }

            scope.today = function() {
                scope.dt = new Date();
            };
            scope.today();

            scope.clear = function() {
                scope.dt = null;
            };

            // Disable weekend selection
            scope.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                scope.opened = true;
            };

            scope.dateOptions = {
                'year-format': "'yy'",
                'starting-day': 2
            };

            validateDateTo();
            commitValue();

            scope.$evalAsync(function() {

                var args = arguments;
                validateDateTo();

                commitValue();

            });

        }

    };

});
