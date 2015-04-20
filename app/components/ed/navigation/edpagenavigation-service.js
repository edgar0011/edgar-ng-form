angular.module('ed.navigation', ['ui.router', 'ed.ui.services'])

.factory('edPageNavigation', function($location, $state, edPageUtils) {
    var lastDesiredState;

    return {

        getCurrentState: function() {

            return $state.current;
        },

        gotoUrl: function(url) {
            $location.url(url);
        },
        gotoState: function(stateName, stateParams) {
            $state.go(stateName, stateParams);
        },
        scrollUp: function(time, offset, selector) {
            return edPageUtils.scrollUp(time, offset, selector);
        },
        path: function(path) {
            return $location.path(path);
        },

        lastDesiredState: function(val) {
            if (val) {
                lastDesiredState = val;
            } else if (val === false) {
                lastDesiredState = null;
            }

            return lastDesiredState;
        }
    };
});
