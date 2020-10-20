const canvas = document.querySelector('canvas');

let ctx = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

ctx.translate(canvas.width / 2, canvas.height / 2);


let isMouseDown = false;
let radius = 4;
let lineCount = 6;
let prevCoords = [];
let angle = 360 / lineCount * Math.PI / 180;

ctx.lineWidth = radius * 2;

var picker = new CP(document.querySelector('#color-picker'));



canvas.addEventListener('mousedown', e => isMouseDown = true);
canvas.addEventListener('mouseleave', e => isMouseDown = false);
canvas.addEventListener('mouseup', e => {
    isMouseDown = false;
    prevCoords = [];
    ctx.beginPath();
}
);


canvas.addEventListener('mousemove', e => {
    if (isMouseDown) {
        for (let i = 0; i < lineCount; i++) {
            ctx.rotate(angle * i);

            let x = e.clientX - canvas.width / 2;
            let y = e.clientY - canvas.height / 2;

            for (let j = 0; j < 2; j++) {
                if (j == 1) {
                    ctx.scale(-1, 1);
                }
                if (prevCoords[i]) {
                    ctx.beginPath();
                    ctx.moveTo(prevCoords[i].x, prevCoords[i].y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    ctx.beginPath();
                }

                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();

            }
            prevCoords[i] = { x, y };
        }
    }
})


document.querySelectorAll('.controller').forEach(input => input.addEventListener('click', e => {
    e.preventDefault();

    if (e.target.value == "+") {
        if (input.classList.contains('line-width')) {
            if (radius < 360) {
                radius += 1;
            }
        }
        else {
            if (lineCount < 360) {
                lineCount += 1;
            }
        }
    }
    else if (e.target.value == "-") {
        if (input.classList.contains('line-width')) {
            if (radius - 1) {
                radius -= 1;
            }
        }
        else {
            if (lineCount - 1) {
                lineCount -= 1;
            }
        }
    }
    else {
        if (input.classList.contains('line-width')) {

            radius = 4;
        }
        else {
            lineCount = 6;
        }
    }

    ctx.lineWidth = radius * 2;

    angle = 360 / lineCount * Math.PI / 180;

    changeLabelValue();
}))

document.querySelector('#reset-canvas').addEventListener('click', e => {
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width / 2, canvas.height / 2);
});


picker.on('change', function (r, g, b, a) {
    if (a === 1) {
        this.source.value = 'rgb(' + r + ', ' + g + ', ' + b + ')';
    } else {
        this.source.value = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
    }
    ctx.fillStyle = `rgba(${r},${g},${b}, ${a})`;
    ctx.strokeStyle = `rgba(${r},${g},${b}, ${a})`;

    document.querySelector('#color-picker').style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    document.querySelector('#color-picker').style.color = `rgba(${Math.abs(r - 255)}, ${Math.abs(g - 255)}, ${Math.abs(b - 255)}, ${a})`;
});

document.getElementById('download-link').addEventListener('click', function (e) {
    const dataURL = canvas.toDataURL('image/png');
    this.href = dataURL;
    this.download = "mypainting.png";
}, false);

function changeLabelValue() {
    document.querySelector('#width-label').textContent = "Line Width: " + radius * 2;
    document.querySelector("#lines-label").textContent = "Lines Count: " + lineCount;
}

changeLabelValue();

