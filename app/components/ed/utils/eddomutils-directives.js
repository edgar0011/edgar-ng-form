angular.module('ed.ui.directives')

.directive("imgLoaded", ["$timeout", function($timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on("load", loadHandler);

            function loadHandler(event) {
                console.log("Image Loaded " + element);
                scope.$apply(attrs.imgLoaded);
            }

            scope.$on('$destroy', function() {
                element.off("load", loadHandler);
            });
        }
    };
}]);
/**
 * Created by edgar on 17/01/15.
 */
