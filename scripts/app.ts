import * as signalR from '@aspnet/signalr';

$(document).ready(() => {

    var _canvasId = '',
        _drawing = false,
        _joinedCanvas = false,
        _artistId: number,
        _artists: IArtist[] = [],
        _query = getUrlVars(),
        $joinCanvasId = $('#joinCanvasId'),
        $startModal: any = $('#startModal'),
        $canvas = <HTMLCanvasElement>$('#canvas')[0],
        _ctx = $canvas.getContext("2d"),
        _connection = new signalR.HubConnection(new signalR.HttpConnection('/hubs/drawing', { transport: signalR.TransportType.WebSockets }));

    console.log($('#shareCanvasId').text());
    
    _ctx.canvas.width = document.body.clientWidth;
    _ctx.canvas.height = document.body.clientHeight;

    _connection.start()
        .then(() => {
            if (_query['canvasid']) {
                joinCanvas(_query['canvasid']);
            } else {
                $startModal.modal('show');
            }
        }).catch((e) => {
            console.log(e);
            alert('Error: Could not connect to the server.');
        });
    
    $startModal.on('hidden.bs.modal', function () {
        joinCanvas($('#shareCanvasId').text());
    });

    var prevPoint: IPoint;
    _connection.on("NewPoint", (point: IPoint) => {

        if (_artists[point.artistid].PreviousPoint != null) return draw(point);
        if (point.x != null) {
            _artists[point.artistid].PreviousPoint = point;
        } else {
            _artists[point.artistid].PreviousPoint = null;
        }
    });

    _connection.on("NewArtist", (artists: IArtist[]) => {
        _artists = artists;
    });

    _connection.on("ClearPoint", (artistId: number) => {
        _artists[artistId].PreviousPoint = null;
    });

    _connection.on("JoinedCanvas", (artistId: number, artists: IArtist[]) => {
        _artistId = artistId;
        _artists = artists;
        _joinedCanvas = true;
    });

    function joinCanvas(id: string) {
        if (_joinedCanvas) return; //Already joined a canvas, so leave
        _connection.invoke('JoinCanvas', id);
        _canvasId = id;
    }

    function draw(point: IPoint) {
        let artist = _artists[point.artistid];
        
        if (artist.PreviousPoint != null) {
            _ctx.beginPath();
            _ctx.moveTo(artist.PreviousPoint.x, artist.PreviousPoint.y);
            _ctx.lineTo(point.x, point.y);
            _ctx.strokeStyle = artist.rgb;
            _ctx.lineWidth = 1;
            _ctx.stroke();
            _ctx.closePath();    
        } 
        _artists[point.artistid].PreviousPoint = point;
    }

    function drawPoint(e: any) {
        e.preventDefault();
        if (e.touches) e = e.touches[0];
        if (!_joinedCanvas || !_drawing) return;
        _connection.invoke('Draw', e.clientX - $canvas.offsetLeft, e.clientY - $canvas.offsetTop, _canvasId, _artistId);
    }

    function startDrawing(e: MouseEvent) {
        e.preventDefault();
        _drawing = true;
        drawPoint(e);
    }

    function stopDrawing(e: MouseEvent) {
        e.preventDefault();
        _drawing = false;
        _connection.invoke('ClearPoint', _canvasId, _artistId);
    }

    $canvas.addEventListener("mousemove", drawPoint.bind(null), false);
    $canvas.addEventListener("touchmove", drawPoint.bind(null), false);

    $canvas.addEventListener("mousedown", startDrawing.bind(null), false);
    $canvas.addEventListener("touchstart", startDrawing.bind(null), false);

    $canvas.addEventListener("mouseup", stopDrawing.bind(null), false);
    $canvas.addEventListener("touchend", stopDrawing.bind(null), false);
});

function getUrlVars() {
    var vars: any = [], hash: any;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}