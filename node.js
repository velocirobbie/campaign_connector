// Imports
const express = require('express')
const http = require('http')
const app = express()
const port = 5000

// Listen on Port 5000
app.listen(port, () => console.info(`App listening on port ${port}`))

// Static Files
app.use(express.static('public'));

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Navigation
app.get('', (req, res) => {
    res.render('index', { text: 'Hey' })
})

//app.get('/about', (req, res) => {
//   res.sendFile(__dirname + '/views/about.html')
//})


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
