document.addEventListener("DOMContentLoaded", function () {

    function createMain() {
        return new Promise(function (resolve, rej) {
            var canvas = document.getElementById('main');
            var context = canvas.getContext('2d');
            var imageObj = new Image();

            imageObj.src = '/winnie.jpg';

            imageObj.onload = function () {
                context.drawImage(this, 0, 0);

                resolve(canvas);
            };
            imageObj.onerror = function () {
                rej(this);
            }
        });
    }

    createMain().then(function (mainCanvas) {
        var testCanvas = document.getElementById('test'),
            lastScore = 0, j = 0, sh = 0;
        setInterval(function () {
            var mutations = [];
            for (var i = 0; i < 100; i++) {
                mutations.push(makeMutation(testCanvas, mainCanvas, lastScore));
            }
            mutations.sort(function (a, b) {
                if (a.score > b.score) {
                    return -1;
                } else if (b.score > a.score) {
                    return 1;
                } else {
                    return 0;
                }
            });
            j++;
            if (mutations[0].score > lastScore) {
                sh++;
                drawTriangle(testCanvas, mutations[0].shape, mutations[0].color);
                lastScore = mutations[0].score;
                document.getElementById('text').innerHTML = 'iterations:' + j + ' shapes:' + sh + ' score:' + mutations[0].score;
            }
        }, 50);

    });

    function getColorUnderShape(mainCanvas, tri) {
        var x = (tri[0].x + tri[1].x  +tri[2].x) / 3,
            y = (tri[0].y + tri[1].y  +tri[2].y) / 3;
        var RGB = mainCanvas
            .getContext('2d')
            .getImageData(x, y, 1, 1)
            .data;
        return 'rgba(' + [RGB[0], RGB[1], RGB[2], 1].join(',') + ')';
    }

    function makeMutation(canvas, mainCanvas, lastScore) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        context.drawImage(canvas, 0, 0);
        var tr = createTriangle(newCanvas, lastScore),
            color = getColorUnderShape(mainCanvas, tr.coords);
        drawTriangle(newCanvas, tr.shape, color);
        var myNode = document.getElementById("tt");
        myNode.innerHTML = '';
        myNode.appendChild(newCanvas);
        return {score: compareTwoImages(mainCanvas, newCanvas), shape: tr.shape, color: color};
    }


    function compareTwoImages(first, second) {
        var firstRGB = first
                .getContext('2d')
                .getImageData(0, 0, first.width, first.height)
                .data,
            secondRGB = second
                .getContext('2d')
                .getImageData(0, 0, second.width, second.height)
                .data,
            onePixelSame = 100 / (firstRGB.length / 4),
            sameOn = 0;
        for (var i = 0; i < firstRGB.length; i += 4) {
            if (
                lI(firstRGB[i]) === lI(secondRGB[i]) &&
                lI(firstRGB[i + 1]) === lI(secondRGB[i + 1]) &&
                lI(firstRGB[i + 2]) === lI(secondRGB[i + 2])
            ) {
                sameOn += onePixelSame;
            }
        }

        return sameOn;
    }

    function lI(number) {
        return number;
    }

    function drawTriangle(canvas, shape, color) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fill(shape);
    }

    function createTriangle(canvas, lastScore) {
        var shape = new Path2D();
        var coords = [{x: randomMax(canvas.width), y: randomMax(canvas.height)},
            {x: randomMax(canvas.width), y: randomMax(canvas.height)},
            {x: randomMax(canvas.width), y: randomMax(canvas.height)}];
        shape.moveTo(coords[0].x, coords[0].y);
        shape.lineTo(coords[1].x, coords[1].y);
        shape.lineTo(coords[2].x, coords[2].y);
        // shape.rect(coords[0].x, coords[0].y, coords[1].x, coords[1].y);
        return {shape: shape, coords: coords};
    }

    function randomMax(max) {
        return Math.floor(Math.random() * max);
    }

    function randomBTW(max) {
        var min = max - max,
            r = Math.random() * (max - min) + min;
        return r < 4 ? 4 : r;
    }

});