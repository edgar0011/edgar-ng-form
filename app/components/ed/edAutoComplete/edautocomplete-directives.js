angular.module("ed.ui.directives")

//example, to be replace by implementation
.run(['$templateCache', function($templateCache) {
    $templateCache.put('edAutoCompleteItem.html', '<a href="#"><span ng-bind-html="match.model.title | typeaheadHighlight:query">{{match}}</span></a>');
}])

.directive('edAutoComplete', function(edAutoCompleteEvents) {
    return {
        restrict: "E",
        scope: {
            selectedValue: "=",
            lookUpMethod: "&",
            selectedItemHandler: "&",
            lookUpStartHandler: "&",
            lookUpEndHandler: "&",
            required: "=",
            templateId: "@",
            placeHolder: "@",
            focusFirst: "@",
            query: "=",
            name: "@",
            minLength: "@",
            maxLength: "@",
            pattern: "@ngPattern",
            mask: "@mask"
        },
        template: "<div class='right-inner-addon'>" +
            "<input name='{{name}}' ed-select-on-click class='form-control' data-ng-model='query' " +
            "ng-minlength='{{minLength}}' ng-maxlength='{{maxLength}}' typeahead='item for item in lookUp($viewValue) | filter:$viewValue' " +
            "typeahead-on-select='onSelectedHandler($item)' placeholder='{{placeHolder}}' " +
            "typeahead-focus-first='{{focusFirst}}' typeahead-template-url='{{templateId}}' " +
            "ng-required='required' ng-pattern='pattern' ui-maskX='{{mask}}' />" +
            "</div>",
        link: function(scope, element, attrs) {

            scope.query = null;
            scope.items = [];

            scope.pattern = new RegExp(attrs.ngPattern);

            scope.onSelectedHandler = function(item) {
                scope.selectedValue = !angular.isFunction(scope.selectedItemHandler) ? item : scope.selectedItemHandler({
                    item: item
                });
            };

            scope.lookUpStart = function() {
                if (angular.isFunction(scope.lookUpStartHandler)) {
                    scope.lookUpStartHandler();
                }
                scope.$emit(edAutoCompleteEvents.AUTOCOMPLETE_LOOK_UP_START);
            };

            scope.lookUpEnd = function(result) {
                if (angular.isFunction(scope.lookUpEndHandler)) {
                    scope.lookUpEndHandler({
                        result: result
                    });
                }
                scope.$emit(edAutoCompleteEvents.AUTOCOMPLETE_LOOK_UP_END);
            };

            scope.lookUp = function(viewValue) {
                scope.lookUpStart();

                return scope.lookUpMethod({
                    value: viewValue,
                    resultCallBack: function(response) {
                        scope.items = response;
                        scope.lookUpEnd(response);
                    },
                    faultCallBack: function(error) {
                        scope.lookUpEnd(error);
                    }
                });
            };
        }
    };
});
