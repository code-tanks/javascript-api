// Import the Node.js http module
const http = require('http');
const url = require('url');

const api = require('./lib/api.js');
const my_tank = require('./tanks/my_tank.js');


let tank = my_tank.createTank();

http.createServer(function (req, res) {
    const path = url.parse(req.url, true).pathname; // parse the URL path
    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write('pong');
        res.end();
    } else if (path === '/request_commands') {
        tank.run();

        let json = JSON.stringify(tank.commands);

        tank.commands.length = 0;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(json);
        res.end();
    } else if (path === '/request_commands_by_event') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            const data = JSON.parse(body);

            tank.onEvent(data);

            let json = JSON.stringify(tank.commands);

            tank.commands.length = 0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(json);
            res.end();
        });
    } else { // for all other paths
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('Page not found');
        res.end();
    }

}).listen(8080); // Server object listens on port 8081

console.log('Node.js web server at port 8081 is running..')