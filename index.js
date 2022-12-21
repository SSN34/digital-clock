let canvas = document.getElementsByTagName("canvas")[0];
let inputTimer = document.getElementById("timer");

let alarm = new Audio();
alarm.src = "./alarm.mp3";

let timerValue = 0;
let timerCount = 0;
let timerRunning = false;

inputTimer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let inputTime = new Time(e.target.value);
        if(inputTime.ready){

            timerValue = inputTime.getTimerValue();
            timerCount = 0;
            timerRunning = true;
        }
        inputTimer.value = "";
    }
});

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const clockRadius = Math.min(window.innerHeight, window.innerWidth) / 2 - 10;

let ctx = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

ctx.translate(WIDTH / 2, HEIGHT / 2);
ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

let Time = {
    second: 0,
    minute: 0,
    hour: 0,
};

let watchHandType = {
    M: {
        color: "#2c6fbb",
        length: clockRadius * 0.8,
        lineWidth: 5,
    },
    H: {
        color: "#61b33b",
        length: clockRadius * 0.5,
        lineWidth: 10,
    },
    S: {
        color: "red",
        length: clockRadius * 0.9,
        lineWidth: 1,
    },
};

function drawWatchHand(angle, type) {
    let { color, length, lineWidth } = watchHandType[type];

    let additions = {
        x: clockRadius * 0.1 * Math.cos((Math.PI / 180) * (angle + 90)),
        y: clockRadius * 0.1 * Math.sin((Math.PI / 180) * (angle + 90)),
    };

    if (type == "S") {
        ctx.beginPath();
        ctx.arc(additions.x, additions.y, clockRadius * 0.02, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.lineWidth = 5;
        ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(type === "S" ? additions.x : 0, type === "S" ? additions.y : 0);
    ctx.lineTo(
        length * Math.cos((Math.PI / 180) * (angle - 90)),
        length * Math.sin((Math.PI / 180) * (angle - 90))
    );
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawClock() {
    ctx.beginPath();
    ctx.arc(0, 0, clockRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 5;
    ctx.stroke();
}

function drawTime(hour, minute, second) {
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${clockRadius * 0.4}px monospace`;
    ctx.fillStyle = "darkgrey";
    ctx.globalAlpha = 0.2;
    ctx.fillText(
        `${hour < 10 ? "0" + hour : hour}:${
            minute < 10 ? "0" + minute : minute
        }:${second < 10 ? "0" + second : second}`,
        0,
        0
    );
    ctx.globalAlpha = 1;
}

function drawTimer() {
    if (timerValue > 0) {
        ctx.beginPath();
        ctx.arc(
            0,
            0,
            clockRadius * 0.95,
            -Math.PI / 2,
            ((timerValue - timerCount) / timerValue) * 2 * Math.PI - Math.PI / 2
        );
        ctx.strokeStyle = "#ffc375";
        ctx.lineWidth = 15;
        ctx.stroke();
    }
}

setInterval(() => {
    let d = new Date(Date.now());

    let second = d.getSeconds();
    let minute = d.getMinutes() + second / 60;
    let hour = d.getHours() + minute / 60;



    if (timerValue > 0) {
        timerCount++;
    }

    if (timerCount === timerValue && timerRunning) {
        timerCount = 0;
        timerValue = 0;
        timerRunning = false;
        alarm.play();
    }
    
}, 1000);


function draw(){
    ctx.clearRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
    ctx.fillStyle = "black";
    ctx.fillRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);

    drawTime(parseInt(hour), parseInt(minute), second);
    drawClock();

    if (timerValue > 0) {
        drawTimer();
    }

    drawWatchHand(360 * (hour / 12), "H");
    drawWatchHand(360 * (minute / 60), "M");
    drawWatchHand(360 * (second / 60), "S");
}


window.addEventListener("resize", () => window.location.reload());
document.addEventListener("keydown", (e) => {
    if(e.key === "t"){
        inputTimer.focus();
    }
});
