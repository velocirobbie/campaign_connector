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

server.get('/methodology', (req, res) => {
  res.render('methodology.ejs')
})

server.get('/about', (req, res) => {
  res.render('about.ejs')
})

server.get('/:constit/connections', (req, res) => {
  res.render('constit-rank.ejs', {constit: req.params.constit})
});

server.get('/:constit', (req, res) => {
  res.render('constit.ejs', {constit: req.params.constit})
});

