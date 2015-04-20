angular.module("ed.ui.directives")

.directive('edTermSelector', function(edMessageBus, edAlertMessageConstants, edCoreConstants, EventTermsUtils) {

    return {

        templateUrl: "components/ed/edTermSelector/edtermselector.html",
        scope: {
            terms: "=",
            format: "@",
            today: "=",
            termAdded: "&",
            termRemoved: "&",
            minDate: "="
        },
        require: "ngModel",
        link: function(scope, element, attrs, ngModelController) {

            scope.addTermAction = function() {

                scope.newTerm = EventTermsUtils.createTerm();

                scope.addingNewTerm = true;
            };

            scope.confirmAddTermAction = function() {

                scope.addTerm(angular.copy(scope.newTerm));
                scope.addingNewTerm = false;
            };

            scope.addTerm = function(term) {

                scope.terms = scope.terms || [];

                /*var match = false;
                angular.forEach(scope.terms, function(item, index) {

                    if (term.dateFrom.getTime() === item.dateFrom.getTime() &&
                        term.dateTo.getTime() === item.dateTo.getTime()) {
                        match = true;
                        return;
                    }
                });

                if (!match) {*/

                if (!EventTermsUtils.isTermOverlapping(term, scope.terms)) {
                    scope.terms.push(term);

                    if (angular.isFunction(scope.termAdded)) {

                        scope.termAdded({
                            term: term
                        });

                    }
                } else {
                    edMessageBus.emit(
                        edAlertMessageConstants.MESSAGE_EVT, {
                            message: "csTime.FORM.TERM_ALREADY_EXIST",
                            errorLevel: 0,
                            context: edCoreConstants.errorMessageContexts.VALIDATION
                        }
                    );
                }

                if (scope.terms && scope.terms.length > 0) {
                    ngModelController.$setValidity("required", true);
                } else {
                    ngModelController.$setValidity("required", false);
                }

            };

            scope.removeTerm = function(term) {

                if (!scope.terms) {

                    return false;
                }

                /*angular.forEach(scope.terms, function(item, index) {

                    if (date.getTime() === item.getTime()) {
                        scope.terms.splice(scope.terms.indexOf(date), 1);
                    }
                });*/

                var index = scope.terms.indexOf(term);
                if (index > -1) {
                    scope.terms.splice(index, 1);
                }

                if (angular.isFunction(scope.termRemoved)) {

                    scope.termRemoved({
                        term: term
                    });

                }

                if (!scope.terms || scope.terms.length === 0) {
                    ngModelController.$setValidity("required", false);
                }

            };

        }
    };
});
