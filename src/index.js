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
        setTimeout(function () {
            var testCanvas = document.getElementById('test'),
                mostColors = getMostUsedColors(mainCanvas),
                lastScore = 0;

            for (var j = 0; j < 20; j++) {
                var mutations = [];

                for (var i = 0; i < 3; i++) {
                    mutations.push(makeMutation(testCanvas, mostColors, mainCanvas));
                }
                if (lastScore < mutations[0].score) {
                    mutations.sort(function (a, b) {
                        if (a.score > b.score) {
                            return -1;
                        } else if (a.score < b.score) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });

                    console.log(mutations[0].score);
                    drawTriangle(testCanvas, mutations[0].mutation.triangle, mutations[0].mutation.color);
                }
            }
        }, 500);
    });


    function compareTwoImages(first, second) {
        var firstRGB = first
                .getContext('2d')
                .getImageData(0, 0, first.width, first.height)
                .data,
            secondRGB = second
                .getContext('2d')
                .getImageData(0, 0, second.width, second.height)
                .data,
            onePixelSame = 100 / (firstRGB.length / 16),
            sameOn = 0;
        for (var i = 0; i < firstRGB.length; i += 16) {
            if (
                lI(firstRGB[i]) === lI(secondRGB[i]) &&
                lI(firstRGB[i + 1]) === lI(secondRGB[i + 1]) &&
                lI(firstRGB[i + 2]) === lI(secondRGB[i + 2]) &&
                lI(firstRGB[i + 3]) === lI(secondRGB[i + 3])) {
                sameOn += onePixelSame;
            }
        }

        return sameOn;
    }

    function getMostUsedColors(canvas) {
        var RGBA = canvas
                .getContext('2d')
                .getImageData(0, 0, canvas.width, canvas.height)
                .data,
            pixelsCount = (RGBA.length / 4) * .01;

        var colors = {};
        var colorsArr = [];

        for (var i = 0; i < RGBA.length; i += 4) {
            var now = [lI(RGBA[i]), lI(RGBA[i + 1]), lI(RGBA[i + 2])].join(',');
            colors[now] ? colors[now]++ : colors[now] = 1;
        }

        Object.keys(colors).forEach(function (item) {
            if (colors[item] >= pixelsCount) {
                colorsArr.push(item);
            }
        });

        return colorsArr;
    }

    function lI(number) {
        return (number / 10).toFixed() * 10;
    }

    function drawTriangle(canvas, shape, color) {
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgb(' + color + ')';
        ctx.fill(shape);
        // ctx.fillRect(randomBTW(canvas.width), randomBTW(canvas.height), randomBTW(canvas.width), randomBTW(canvas.width));
    }

    function createTriangle(canvas) {
        var shape = new Path2D();
        shape.moveTo(randomBTW(canvas.width), randomBTW(canvas.height));
        shape.lineTo(randomBTW(canvas.width), randomBTW(canvas.height));
        shape.lineTo(randomBTW(canvas.width), randomBTW(canvas.height));
        return shape;
    }

    function makeMutation(oldCanvas, colors, mainCanvas) {
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        context.drawImage(oldCanvas, 0, 0);

        var triangle = createTriangle(newCanvas),
            colorMutations = {},
            bestM = 0;
        colors.forEach(function (color) {
            drawTriangle(newCanvas, triangle, color);
            colorMutations[compareTwoImages(mainCanvas, newCanvas)] = {triangle: triangle, color: color};
            // console.log(compareTwoImages(mainCanvas, newCanvas));
        });
        Object.keys(colorMutations).forEach(function (item) {
            if (bestM < item) {
                bestM = item;
            }
        });
        return {mutation: colorMutations[bestM], score: bestM};
    }

    function randomBTW(btw) {
        return Math.floor(Math.random() * btw);
    }

});