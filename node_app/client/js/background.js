function get(el) {
    if (typeof el === "string")
        return document.getElementById(el);
    return el;
}

var rand = function (max, min, _int) {
    var max = (max === 0 || max) ? max : 1,
        min = min || 0,
        gen = min + (max - min) * Math.random();

    return (_int) ? Math.round(gen) : gen;
};

function setStyleCss3(object, key, value) {
    var keyName = key.substr(0, 1).toUpperCase() + key.substr(1);
    object.style['webkit' + keyName] = value;
    object.style['moz' + keyName] = value;
    object.style['ms' + keyName] = value;
    object.style[key] = value;
}

/*============================================*/

var MusicEqualizerBar = (function () {

    var container = get('widgetContainer');
    var canvas = get('widgetCanvas');
    var ctx = canvas.getContext('2d');

    var containerWidth, containerHeight;

    var isRunning = false;
    var isStop = false;

    var maxHeight = 90;
    var minHeight = 20;

    var allBars = new Array();

    var timeoutAnimate;
    var durationTimeoutAnimate = 1000 / 60;

    var DIRECTION_BOTH = "Both";
    var DIRECTION_UPWARDS = "Downwards";
    var DIRECTION_BOTTOM = "TOP";

    var baseDuration = 4;
    var duration = 4;
    var currentX = 0;

    /*--- settings from banner flow ---*/
    var color, size, speed, space, direction;


    function startWidget(currentSesssion) {

        if (!containerWidth || !containerHeight)
            return;

        canvas.width = containerWidth;
        canvas.height = containerHeight;
        ctx.fillStyle = color;
        duration = (baseDuration / speed * 5000) / durationTimeoutAnimate;
        allBars = new Array();

        createMusicBars();

        animateBars();

    }

    function calculateHeightBaseOnSin(left) {
        var cycle = containerWidth / 2;
        return Math.sin(left * 2 * Math.PI / cycle) * containerHeight / 4 + containerHeight / 2 + rand(containerHeight / 4, -containerHeight / 4, true);
    }

    function createMusicBars() {
        var numberBar = 0;
        while (true) {
            var bar = {};
            bar.width = size;

            var left = numberBar * (size + space);
            var height = calculateHeightBaseOnSin(left);
            var top = (containerHeight - height) / 2;
            if (direction.toLowerCase() == DIRECTION_BOTTOM.toLowerCase())
                top = 0;
            else if (direction.toLowerCase() == DIRECTION_UPWARDS.toLowerCase())
                top = (100 - height) / 100 * containerHeight;

            bar.height = height;
            bar.nextHeight = height;
            bar.deltaHeight = 0;
            bar.direction = -1;
            bar.top = top;
            bar.color = color;
            bar.left = left;

            allBars.push(bar);

            numberBar++;

            if (numberBar * (size + space) >= containerWidth - size)
                break;
        }
    }

    function calculateNextHeightBars() {
        currentX -= containerWidth / 2 / 10;
        if (currentX < -containerWidth / 2)
            currentX = 0;

        for (var i = 0; i < allBars.length; i++) {
            var bar = allBars[i];
            var height = calculateHeightBaseOnSin(bar.left + currentX);
            bar.nextHeight = height;
            bar.deltaHeight = (bar.nextHeight - bar.height) / duration;
            bar.direction = height > bar.height ? 1 : -1;
        }
    }

    function calculateHeightBars() {
        var isEnd = false;

        for (var i = 0; i < allBars.length; i++) {
            allBars[i].height += allBars[i].deltaHeight;
            if (allBars[i].direction > 0) {
                if (allBars[i].height >= allBars[i].nextHeight) {
                    allBars[i].height = allBars[i].nextHeight;
                    isEnd = true;
                }
            } else {
                if (allBars[i].height <= allBars[i].nextHeight) {
                    allBars[i].height = allBars[i].nextHeight;
                    isEnd = true;
                }
            }

            allBars[i].top = (containerHeight - allBars[i].height) / 2;
            if (direction.toLowerCase() == DIRECTION_BOTTOM.toLowerCase())
                allBars[i].top = 0;
            else if (direction.toLowerCase() == DIRECTION_UPWARDS.toLowerCase())
                allBars[i].top = containerHeight - allBars[i].height;
        }

        if (isEnd) {
            calculateNextHeightBars();
        }
    }


    function animateBars() {

        timeoutAnimate = setTimeout(function () {

            if (isStop) {

                isRunning = false;

                return;
            }

            isRunning = true;

            clearTimeout(timeoutAnimate);

            calculateHeightBars();

            drawMusicBars();

            animateBars();

        }, durationTimeoutAnimate);
    }

    function drawMusicBars() {
        ctx.save();
        ctx.clearRect(0, 0, containerWidth, containerHeight);
        for (var i = 0; i < allBars.length; i++) {
            ctx.fillRect(allBars[i].left, allBars[i].top, size, allBars[i].height);
        }
        ctx.restore();
    }

    /*==============================================*/
    /*===== Start point of animation  =====*/
    /*==============================================*/

    function reloadGlobalVariables() {

        containerWidth = parseInt(window.getComputedStyle(container).getPropertyValue('width'));
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height'));

    }

    function stopCurrentAnimation(callback) {

        isStop = true;

        if (isRunning) {
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                stopCurrentAnimation(callback);
            }, 200);
        } else {
            isStop = false;
            if (callback)
                callback();
        }

    }

    function startAnimation(currentSesssion) {
        stopCurrentAnimation(function () {
            startWidget(currentSesssion);
        });
    }

    /*==============================================*/
    /*===== Default settings from Banner Flow  =====*/
    /*==============================================*/

    function loadSettings() {
        color = "rgb(231, 231, 231)";
        size = 5;
        speed = 20;
        space = 2;
        direction = DIRECTION_UPWARDS;

    }

    /*====================================================*/

    var timeoutStart;
    var sessionId = 0;

    function init() {
        if (timeoutStart) {
            clearTimeout(timeoutStart);

            timeoutStart = setTimeout(function () {
                loadSettings();
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 500);
        } else {
            timeoutStart = setTimeout(function () {
                loadSettings();
                reloadGlobalVariables();
                startAnimation(++sessionId);
            }, 0);
        }
    }

    var isStartAnimation = false;

    function onStart() {
        if (typeof BannerFlow != "undefined" && !BannerFlow.editorMode && isStartAnimation) {
            return;
        }

        isStartAnimation = true;
        init();
    }


    function onResize() {
        if (typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        init();
    }

    function resetParameter() {
        if (typeof BannerFlow != "undefined" && !BannerFlow.editorMode) {
            return;
        }

        init();
    }

    return {
        start: onStart,

        onResized: onResize,

        onSettingChanged: resetParameter
    };
})();

MusicEqualizerBar.start();
