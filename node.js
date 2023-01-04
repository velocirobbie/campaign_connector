// Imports
const express = require('express')
const http = require('http')
const fs = require('fs')
const ejs = require('ejs')
const server = express()
const port = process.env.PORT || 5000

// Listen on Port 5000
server.listen(port, () => console.info(`App listening on port ${port}`))

// Static Files
server.use(express.static('public'));
server.use(express.static('app'));
analysis = JSON.parse(fs.readFileSync('public/analysis.json', 'utf8'));
console.log(analysis)

// Set View's
server.set('views', './views');
server.set('view engine', 'ejs');

// Navigation
server.get('', (req, res) => {
    res.render('index.ejs')
})

server.get('/:constit/connections', (req, res) => {
  res.render('constit-rank.ejs', {constit: req.params.constit})
});

server.get('/:constit', (req, res) => {
  res.render('constit.ejs', {constit: req.params.constit})
});

/*const constit_keys = Object.keys(analysis)
for (i = 0; i < constit_keys.length; i++) {
  server.get('/rank/'+constit_keys[i], (req, res) => {
    res.render('index')
  })
}*/

//server.get('/analysis', (req, res) => {
//  res.
//server.get('/about', (req, res) => {
//   res.sendFile(__dirname + '/views/about.html')
//})

// Data



/*
var url  = require('url'),
    sys  = require('sys'),
    path = require('path'),
    express = require('express'),
    http=require('http');

var app = express();
var server = http.createServer(app);

app.engine('.html');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
});

app.listen(4000);
//sys.puts('server running ' + 'now ' + Date.now());

*/
/*
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  fs.readFile('views/index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);
*/
