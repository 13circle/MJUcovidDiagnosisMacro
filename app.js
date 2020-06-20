const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const mysql = require('mysql');
const dbConfig = require('./config/database');

const connection = mysql.createConnection(dbConfig);

const app = express();
const publicDir = src => path.join(__dirname + '/public/' + src);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(publicDir('index.html'));
});

app.post('/registration', (req, res) => {
    res.send(req.body);
});

app.post('/login', (req, res) => {
    res.send(req.body);
});

app.listen(51122, () => console.log('Server Running...'));