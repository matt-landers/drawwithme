using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace drawwithme.Hubs
{
    public class DrawingHub: Hub
    {
        public async Task Draw(int x, int y, string id) {
            await Clients.Group(id).SendAsync(
                "NewPoint", 
                new Point() {
                    x = x,
                    y =y
                });
        }

        public async Task JoinCanvas(string id) {
            await Groups.AddAsync(Context.ConnectionId, id);
        }

        public class Point {
            public int x;
            public int y;
            public string clientId;
        }
    }
}
