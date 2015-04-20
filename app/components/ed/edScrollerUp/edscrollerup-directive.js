angular.module("ed.ui.directives")

.directive("edScrollerUp", function($document, edPageNavigation) {
    return {
        restrict: "AEC",
        link: function(scope, element, attrs) {
            var bodyEl = $document[0].body;
            var offset = attrs.edScrollerUpOffset || 0;

            if (typeof offset == "string") {
                offset = parseInt(offset);
            }

            function scrollHandler() {
                var st = bodyEl.scrollTop;
                if (st > offset) {
                    scope.edScrollerUpShow = true;
                } else {
                    scope.edScrollerUpShow = false;
                }
                scope.$digest();
            }

            angular.element($document).on("scroll", scrollHandler);
            element.on('click', function() {
                edPageNavigation.scrollUp();
            });
        }
    };
})

.animation('.animated-show-item', function() {

    return {
        beforeAddClass: function(element, className, done) {
            //addClass : function(element, className, done) {
            //alert("animated-show-item beforeAddClass " + className);
            if (className == 'ng-hide') {
                TweenMax.to(element, 0.4, {
                    opacity: 0,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    ease: Power2.easeOut,
                    onComplete: function() {
                        //alert("ANIM on beforeAddClass DONE");
                        done();
                    }
                });
            } else {
                done();
            }
        },
        removeClass: function(element, className, done) {
            //alert("animated-show-item removeClass " + className);
            if (className == 'ng-hide') {
                element.css('opacity', 0);
                TweenMax.to(element, 0.4, {
                    opacity: 1,
                    scaleX: 1,
                    scaleY: 1,
                    onComplete: done
                });
            } else {
                done();
            }
        }
    };

});
