angular.module('ed.ui.services')

.factory("edPageUtils", function($window, $document, edCoreConstants) {
    var edPageUtils = {};

    var scrollBlocks = 0;

    var scrollListener = function(event) {
        event.preventDefault();
        event.stopPropagation();

    };
    // left: 37, up: 38, right: 39, down: 40,
    // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
    var keys = [37, 38, 39, 40];
    var keyDownListener = function(e) {
        for (var i = keys.length; i--;) {
            if (e.keyCode === keys[i]) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        }
    };

    edPageUtils.disableScroll = function() {
        scrollBlocks++;
        if (!angular.element($document[0].body).hasClass("noscroll")) {
            angular.element($document[0].body).addClass("noscroll");
        }
        try {
            angular.element($window).off("DOMMouseScroll", scrollListener);
        } catch (error) {

        }
        angular.element($window).on("DOMMouseScroll", scrollListener);
        $window.onmousewheel = $document.onmousewheel = scrollListener;

        $document.onkeydown = keyDownListener;
    };

    edPageUtils.enableScroll = function() {
        scrollBlocks--;
        if (scrollBlocks === 0) {
            if (angular.element($document[0].body).hasClass("noscroll")) {
                angular.element($document[0].body).removeClass("noscroll");
            }
            angular.element($window).off("DOMMouseScroll", scrollListener);

            $window.onmousewheel = $document.onmousewheel = $document.onkeydown = null;

        }
    };

    edPageUtils.isScrollable = function() {
        var docHeight = angular.element($document[0].body).height();
        var wHeight = angular.element($window).height();
        return (docHeight > wHeight);
    };

    edPageUtils.isScrolledIntoView = function(element) {
        var docViewTop = angular.element($window).scrollTop();
        var docViewBottom = docViewTop + angular.element($window).height();

        var elemTop = angular.element(element).offset().top;
        var elemBottom = elemTop + angular.element(element).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    };

    edPageUtils.scrollUp = function(time, offset, selector) {
        if (!angular.isDefined(time) || !angular.isNumber(time)) {
            time = edCoreConstants.ui.SCROLL_UP_DELAY;
        }

        if (!angular.isDefined(offset) || !angular.isNumber(offset)) {
            offset = edCoreConstants.ui.SCROLL_UP_OFFSET;
        }
        if (!angular.isString(selector)) {
            selector = "html, body";
        }

        //TODO enable scrollTop on element found by selector

        if (window.$ || window.jQuery) {

            return $(selector).animate({
                scrollTop: 0
            }, time);
        } else {

            return $document.scrollTop(0, time);
        }
    };

    edPageUtils.getBase64Image = function(img, selection, maxImageDimmension) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");

        //process image ource and target dimmensions
        var scaleX = img.naturalWidth / img.width;
        var scaleY = img.naturalHeight / img.height;

        var scale = scaleX >= scaleY ? scaleY : scaleX;

        var sourceWidth = selection.width * scale;
        var sourceHeight = selection.height * scale;

        var targetWidth = selection.width * scale;
        var targetHeight = selection.height * scale;

        var widthOverMaximum = Math.max(0, targetWidth - maxImageDimmension);
        var heightOverMaximum = Math.max(0, targetHeight - maxImageDimmension);

        if (widthOverMaximum > 0 || heightOverMaximum > 0) {
            if (widthOverMaximum > heightOverMaximum) {
                targetWidth = Math.min(sourceWidth, maxImageDimmension);
                targetHeight = targetWidth / sourceWidth * sourceHeight;
            } else {
                targetHeight = Math.min(sourceHeight, maxImageDimmension);
                targetWidth = targetHeight / sourceHeight * sourceWidth;
            }
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, selection.x1 * scale, selection.y1 * scale, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

        // Get the data-URL formatted image
        var dataURL = canvas.toDataURL("image/jpeg");
        return dataURL.replace("data:image/jpeg;base64,", "");
    };

    return edPageUtils;

});
