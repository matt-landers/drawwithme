/// <reference path="./models.ts" />
$(document).ready(function () {
    var canvasId = '@canvasId', drawing = false, joinedCanvas = false, canvas = $('#canvas')[0], ctx = canvas.getContext("2d"), $joinCanvasId = $('#joinCanvasId'), startModal = $('#startModal'), connection = new signalR.HubConnection(new signalR.HttpConnection('/hubs/drawing', { transport: signalR.TransportType.WebSockets }));
    ctx.canvas.width = document.body.clientWidth;
    ctx.canvas.height = document.body.clientWidth;
    connection.start();
    startModal.modal('show');
    startModal.on('hidden.bs.modal', function () {
        joinCanvas($('#shareCanvasId').text());
    });
    $('#btnJoin').click(function () {
        joinCanvas($joinCanvasId.val());
    });
    var prevPoint;
    connection.on("NewPoint", function (point) {
        if (prevPoint != null)
            return draw(point);
        prevPoint = point;
    });
    function joinCanvas(id) {
        if (joinedCanvas)
            return; //Already joined a canvas, so leave
        connection.invoke('JoinCanvas', id);
        canvasId = id;
        joinedCanvas = true;
    }
    function draw(point) {
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        prevPoint = point;
    }
    function newPoint(e) {
        if (!joinedCanvas || !drawing)
            return;
        connection.invoke('Draw', e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop, canvasId);
    }
    function toggleDrawing(shouldDraw) {
        drawing = shouldDraw;
        if (!shouldDraw)
            prevPoint = null;
    }
    canvas.addEventListener("mousemove", newPoint.bind(null), false);
    canvas.addEventListener("mousedown", toggleDrawing.bind(null, true), false);
    canvas.addEventListener("mouseup", toggleDrawing.bind(null, false), false);
});
//# sourceMappingURL=app.js.map