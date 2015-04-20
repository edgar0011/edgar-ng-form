angular.module("ed.ui.services")

.constant('edAppearConstants', {
    POPUP_CLASS: "ed-popup",
    POPUP_FULL_CLASS: "ed-popup-full",
    POPUP_ANIMATE_CLASS: "animate-fade-up"
})

.factory("edAppear", function edAppear(
    $rootScope, $compile, $controller,
    $injector, $document, $q,
    edAppearConstants, edPageUtils) {

    var serviceInstance = {};
    var backDrop;

    var numOpenedBackDrops = 0;

    function addBackDrop(animateService) {
        if (backDrop === undefined) {
            backDrop = angular.element("<div></div>");
            angular.element(backDrop).addClass("modal-backdrop fade in");
        }
        numOpenedBackDrops++;
        angular.element($document[0].body).append(backDrop);
    }

    function removeBackDrop(animateService) {
        numOpenedBackDrops--;
        if (numOpenedBackDrops <= 0) {
            numOpenedBackDrops = 0;
            if (backDrop !== undefined) {
                angular.element(backDrop).remove();
            }
        }
    }

    serviceInstance.open = function(options) {
        var deferred = $q.defer();
        var popupTemplate = angular.element("<div></div>");

        if (options.templateUrl !== null && options.templateUrl !== undefined) {
            popupTemplate2 = angular.element("<div></div>");
            angular.element(popupTemplate).append(popupTemplate2);
            popupTemplate2.attr("ng-include", "'" + options.templateUrl + "'");
        } else if (options.template !== null && options.template !== undefined) {
            angular.element(popupTemplate).append(angular.element(options.template));
        } else {
            throw new Error("Appear:Template nor TemplateUrl is set");
        }

        if (options.controller === undefined || options.controller === null) {
            throw new Error("Appear:Controller is not set");
        }

        // We give the popup a new isolated scope, inherited from the one provided on options or rootScope.
        var popupScope = options.scope ? options.scope.$new(true) : $rootScope.$new(true);

        var injects = {
            $scope: popupScope
        };

        injects = angular.extend(injects, options.resolve);

        angular.forEach(options.resolve || [], function(value, key) {
            if (key != "$scope") {
                injects[key] = angular.isString(value) ? $injector.get(value) : $injector.invoke(value);
            }
        });

        var popupElement = $compile(popupTemplate)(popupScope);
        popupScope.popupElement = popupElement;

        var templateCtrl = $controller(options.controller, injects);

        angular.element(popupElement).data('$ngControllerController', templateCtrl);

        angular.element(popupElement).addClass(options.popupClass || edAppearConstants.POPUP_CLASS);

        var animateService = $injector.get('$animate');

        if (animateService !== null && animateService !== undefined) {
            angular.element(popupElement).addClass(options.animateClass || edAppearConstants.POPUP_ANIMATE_CLASS);
            animateService.enter(popupElement, angular.element($document[0].body))
                .then(function() {

                });
        } else {
            angular.element($document[0].body).append(popupElement);
        }

        popupScope.$$appearOptions = options;
        if (popupScope.$$appearOptions.backDrop) {
            addBackDrop(animateService);
        }

        edPageUtils.disableScroll();

        function close() {
            if (animateService !== null && animateService !== undefined) {
                animateService.leave(popupElement).then(function() {

                });
            } else {
                angular.element(popupElement).remove();
            }
            if (popupScope.$$appearOptions.backDrop) {
                removeBackDrop(animateService);
            }
            popupScope.$$appearOptions = null;
            edPageUtils.enableScroll();
        }

        popupScope.close = function(result) {
            close();
            deferred.resolve(result);
        };

        popupScope.dismiss = function(reason) {
            close();
            deferred.reject(reason);
        };

        return deferred.promise;
    };

    return serviceInstance;
});
