using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace drawwithme.Hubs
{
    public class DrawingHub: Hub
    {
        private static Dictionary<string, Canvas> canvases = new Dictionary<string, Canvas>();

        public async Task Draw(int x, int y, string canvasId, int artistId) {

            await Clients.Group(canvasId).SendAsync(
                "NewPoint",
                new Point() {
                    artistid = artistId,
                    x = x,
                    y = y
                });
        }

        public async Task ClearPoint(string canvasId, int artistId) {
            await Clients.Group(canvasId).SendAsync("ClearPoint", artistId);
        }

        public async Task JoinCanvas(string canvasId) {

            await Groups.AddAsync(Context.ConnectionId, canvasId); //Add caller to the group
            Artist artist;
            if (!canvases.ContainsKey(canvasId))
            {
                artist = new Artist(0);
                canvases.Add(canvasId, new Canvas(canvasId));
            }
            else {
                artist = new Artist(canvases[canvasId].Artists.Count);
            }

            canvases[canvasId].Artists.Add(artist);
            await Clients.Group(canvasId).SendAsync("NewArtist", canvases[canvasId].Artists); //Broadcast the new artist
            await Clients.Caller.SendAsync("JoinedCanvas", artist.id, canvases[canvasId].Artists); //Tell the caller their artist id and all the artists
        }

        public class Point {
            public int? x;
            public int? y;
            public int artistid;
        }

        private class Canvas {
            public string ID;
            public List<Artist> Artists = new List<Artist>();
            public Canvas(string id) {
                this.ID = id;
            }
        }

        public class Artist {
            public int id;
            public string rgb;
            public Artist(int id) {
                this.id = id;
                this.rgb = new Color().ToString();
            }
        }

        private class Color {
            int r;
            int g;
            int b;
            public Color() {
                this.r = new Random().Next(1, 255);
                this.g = new Random().Next(1, 255);
                this.b = new Random().Next(1, 255);
            }
            public override string ToString() {
                return $"rgb({this.r},{this.g},{this.b})";
            }
        }
    }
}
