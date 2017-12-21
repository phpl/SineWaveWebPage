var step = 0;
var width = 0;
var height = 0;
var animate = false;
var worker;

function drawAxes(ctx) {
    ctx.strokeStyle = "gray";
    ctx.beginPath();
    drawXAxe(ctx, width, height);
    drawYAxe(ctx, width, height);
}

function drawXAxe(ctx) {
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

function drawYAxe(ctx) {
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

function drawSine(ctx, step) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    var x = -1;
    var y;
    while (x < width) {
        y = countY(x, step);
        ctx.lineTo(x, y);
        x++;
    }

    ctx.stroke();
    drawCircle(ctx, x, y)
}

function countY(x, step) {
    var speed = 20;
    var amplitude_multiplier = document.getElementById("A").value;
    var amplitude = 40 * amplitude_multiplier;
    var frequency = document.getElementById("f").value;
    var phase = document.getElementById("phase").value;

    return height / 2 + amplitude * Math.sin((2 * frequency * (x + step) / speed) + (1 * phase));
}

function drawCircle(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";

    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function draw() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    context.clearRect(0, 0, width, height);

    drawAxes(context);
    drawSine(context, step);

    if (animate == true) {
        step += 1;
        window.requestAnimationFrame(draw);
    }
}

function stopAnimate() {
    animate = false;
    if (typeof (worker) != "undefined") {
        stopWorker();
    }
    draw();
}

function startAnimate() {
    if (animate == false) {
        animate = true;
        startWorker();
        draw();
    }
}

function startWorker() {
    if (typeof (Worker) !== "undefined") {
        if (typeof (worker) == "undefined") {
            worker = new Worker("counterWorker.js");

            worker.onmessage = function (event) {
                document.getElementById("animationTime").innerHTML = "Czas animacji [s] - WebWorker: " + event.data;
            }
        }
    } else {
        document.getElementById("animationTime").innerHTML = "Twoja przegladarka nie wspiera Web Workerow!";
    }
}

function stopWorker() {
    worker.terminate();
    worker = undefined;
    document.getElementById("animationTime").innerHTML = "Czas animacji [s] - WebWorker: 0";
}