/// <reference path="./models.ts" />
declare var $: any;
import * as signalR from '@aspnet/signalr';

$(document).ready(function () {

    var canvasId = '@canvasId',
        drawing = false,
        joinedCanvas = false,
        _artistId: number,
        _artists: IArtist[] = [],
        $canvas = <HTMLCanvasElement> $('#canvas')[0],
        ctx = $canvas.getContext("2d"),
        $joinCanvasId = $('#joinCanvasId'),
        $startModal = $('#startModal'),
        connection = new signalR.HubConnection(new signalR.HttpConnection('/hubs/drawing', { transport: signalR.TransportType.WebSockets }));

    ctx.canvas.width = document.body.clientWidth;
    ctx.canvas.height = document.body.clientHeight;

    connection.start();

    $startModal.modal('show');
    $startModal.on('hidden.bs.modal', function () {
        joinCanvas($('#shareCanvasId').text());
    });

    $('#btnJoin').click(function () {
        joinCanvas($joinCanvasId.val());
        $startModal.modal('hide');
    });

    var prevPoint: IPoint;
    connection.on("NewPoint", (point: IPoint) => {
        if (_artists[point.artistid].PreviousPoint != null) return draw(point);
        if (point.x != null) {
            _artists[point.artistid].PreviousPoint = point;
        } else {
            _artists[point.artistid].PreviousPoint = null;
        }
    });

    connection.on("NewArtist", (artists: IArtist[]) => {
        console.log(artists);
        _artists = artists;
    });

    connection.on("ClearPoint", (artistId: number) => {
        _artists[artistId].PreviousPoint = null;
    });

    connection.on("JoinedCanvas", (artistId: number, artists: IArtist[]) => {
        _artistId = artistId;
        _artists = artists;
        joinedCanvas = true;
    });

    function joinCanvas(id: string) {
        if (joinedCanvas) return; //Already joined a canvas, so leave
        connection.invoke('JoinCanvas', id);
        canvasId = id;
    }

    function draw(point: IPoint) {
        let artist = _artists[point.artistid];
        ctx.beginPath();
        ctx.moveTo(artist.PreviousPoint.x, artist.PreviousPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = artist.rgb;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        _artists[point.artistid].PreviousPoint = point;
    }

    function newPoint(e: any) {
        if (e.touches) e = e.touches[0];
        if (!joinedCanvas || !drawing) return;
        connection.invoke('Draw', e.clientX - $canvas.offsetLeft, e.clientY - $canvas.offsetTop, canvasId, _artistId);
    }

    function toggleDrawing(shouldDraw: boolean) {
        drawing = shouldDraw;
        if (!shouldDraw) connection.invoke('ClearPoint', canvasId, _artistId);;
    }

    $canvas.addEventListener("mousemove", newPoint.bind(null), false);
    $canvas.addEventListener("mousedown", toggleDrawing.bind(null, true), false);
    $canvas.addEventListener("mouseup", toggleDrawing.bind(null, false), false);

    $canvas.addEventListener("touchstart", toggleDrawing.bind(null, true), false);
    $canvas.addEventListener("touchend", toggleDrawing.bind(null, false), false);
    $canvas.addEventListener("touchmove", newPoint.bind(null), false);

});