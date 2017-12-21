var animationSeconds = 0;

setInterval(function () { runEveryOneSecond() }, 1000);

function runEveryOneSecond() {
    animationSeconds = animationSeconds + 1;
    postMessage('' + animationSeconds);
}