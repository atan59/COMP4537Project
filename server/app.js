const express = require('express');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Endpoints
const getAllEndPoint = '/API/v1/questions';
const getQuestionByIDEndPoint = '/API/v1/questions/:id'
const getStats = '/API/v1/stats';

// Globals
const endpointStats = [
    {
        method: 'GET',
        endpoint: getAllEndPoint,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: getQuestionByIDEndPoint.replace(':', ''),
        requests: 0
    }
];

// const port = process.env.PORT || 8888;
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

// Get request (ALL) or By Category
app.get(getAllEndPoint, (req, res) => {
    let q = url.parse(req.url, true);
    let sql = "";
    if (Object.keys(q.query).length === 0) {
        sql = "SELECT * FROM question";
    } else {
        sql = `SELECT * FROM question WHERE category = '${q.query.category}'`;
    }

    db.connect(() => {
        db.query(sql, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            endpointStats.find(obj => obj.endpoint === getAllEndPoint && obj.requests++);
            res.end(JSON.stringify(result));
        })
    })
})

// Get request (by ID)
app.get(getQuestionByIDEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM question WHERE id = ${req.params.id}`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            endpointStats.find(obj => obj.endpoint === getQuestionByIDEndPoint && obj.requests++);
            res.end(JSON.stringify(result));
        })
    })
})

// Get stats for all endpoints
app.get(getStats, (req, res) => {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(endpointStats));
})

app.get('/', (req, res) => {
    // LEAVE FOR REGISTRATION
    // const username = 'admin';
    // const saltRounds = 10;
    // const password = '1234abcd';
    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //     console.log(hash);
    //     db.connect(() => {
    //         db.query(`INSERT INTO user (username, password) VALUES ('${username}', '${hash}')`)
    //     })
    // })
    const username = 'admin';
    const pass = '1234abcd';
    db.connect(() => {
        db.query(`SELECT * FROM user WHERE username = '${username}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            bcrypt.compare(pass, result[0].password, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                console.log(result);
            })
        })
    })
})

// DO NOT UNCOMMMENT, ALREADY POPULATED DB

// app.get("/", (req, res) => {
//     fs.readFile('./assets/questions.json', (err, data) => {
//         if (err) throw err;
//         const questionArr = JSON.parse(data);

//         let sql = "INSERT INTO question(question, choice1, choice2, choice3, choice4, answer, category) VALUES ";
//         for (let i = 0; i < questionArr.length - 1; i++) {
//             let q = questionArr[i];
//             sql += `("${q.question}","${q.choice1}","${q.choice2}","${q.choice3}","${q.choice4}","${q.answer}","${q.category}"),`
//         }
//         let final = questionArr[questionArr.length - 1];
//         sql += `("${final.question}","${final.choice1}","${final.choice2}","${final.choice3}","${final.choice4}","${final.answer}","${final.category}");`

//         db.connect(() => {
//             db.query(sql, (err, result) => {
//                 if (err) {
//                     console.error(err);
//                     throw err;
//                 }
//                 res.statusCode = 200;
//                 res.end(`Successfully inserted data: ${result}`);
//             })
//         })
//     })
// })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

