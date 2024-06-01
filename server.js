const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filePath = path.join(__dirname, url.pathname);

    switch (req.method) {
        case 'GET':
            if (url.pathname === '/') {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Welcome to the File Management Tool');
            } else {
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        res.end('File not found');
                    } else {
                        res.end(data);
                    }
                });
            }
            break;

        case 'POST':
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                fs.writeFile(filePath, body, (err) => {
                    if (err) {
                        res.end('Error writing file');
                    } else {
                        res.end('File created');
                    }
                });
            });
            break;

        case 'DELETE':
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.end('File not found');
                } else {
                    res.end('File deleted');
                }
            });
            break;

        default:
            res.end('Method not allowed');
            break;
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});