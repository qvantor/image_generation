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
            lastScore = 0, i = 0;
        setInterval(function () {
            var mutation = makeMutation(testCanvas, mainCanvas);
            // if (mutation.score > lastScore) {
                console.log(mutation);
                drawTriangle(testCanvas, mutation.shape, mutation.color);
                lastScore = mutation.score;
            // }
        }, 2);


    });
    
    function getColorUnderShape(mainCanvas, tri) {
        var RGB = mainCanvas
            .getContext('2d')
            .getImageData(tri[0].x + (tri[1].x/2), tri[0].y + (tri[1].x/2), 1, 1)
            .data;
        return 'rgb(' + [RGB[0],RGB[1],RGB[2]].join(',') +')';
    }

    function makeMutation(canvas, mainCanvas) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        context.drawImage(newCanvas, 0, 0);
        var tr = createTriangle(newCanvas),
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

    function createTriangle(canvas) {
        var shape = new Path2D();
        var coords = [{x: randomBTW(canvas.width), y: randomBTW(canvas.height)},
            {x: randomBTW(10), y:randomBTW(10)},
            {x: randomBTW(canvas.width), y:randomBTW(canvas.height)}];
        // shape.moveTo(coords[0].x, coords[0].y);
        // shape.lineTo(coords[1].x, coords[1].y);
        // shape.lineTo(coords[2].x, coords[2].y);
        shape.rect(coords[0].x, coords[0].y,coords[1].x, coords[1].y);
        return {shape: shape, coords: coords};
    }

    function randomBTW(btw) {
        return Math.floor(Math.random() * btw);
    }

});