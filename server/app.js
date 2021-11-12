const express = require('express');
const url = require('url');
const mysql = require('mysql');

const app = express();

// Endpoints
const getEndPoint = '/API/v1/questions';

const port = process.env.PORT || 8888;
const db = mysql.createConnection({
    host: 'comp4537s2.mysql.database.azure.com',
    user: 's2',
    password: 'P@$$w0rd',
    database: 's2projectdb'
});

app.use((req, res, next) => {
    res.header('Content-Type', 'text/html');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

// Get request
app.get(getEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM question`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            res.statusCode = 200;
            res.end(`{"questions":${JSON.stringify(result)}}`);
        })
    })
})

