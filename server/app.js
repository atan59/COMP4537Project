const express = require('express');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// Endpoints
const getAllEndPoint = '/API/v1/questions';
const getQuestionByIDEndPoint = '/API/v1/questions/:id'
const getStatsEndPoint = '/API/v1/stats';
const loginEndPoint = '/API/v1/login';
const AllScoresEndPoint = '/API/v1/scores';
const getScoresByIDEndPoint = '';

// Globals
const endpointStats = [
    {
        method: 'GET',
        endpoint: getAllEndPoint,
        requests: 0
    },
    // {
    //     method: 'GET',
    //     endpoint: getQuestionByIDEndPoint.replace(':', ''),
    //     requests: 0
    // },
    {
        method: 'GET',
        endpoint: AllScoresEndPoint,
        requests: 0
    },
    {
        method: 'POST',
        endpoint: AllScoresEndPoint,
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

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Quiz API",
            description: "A simple Express Quiz API that provides questions and answers on a wide variety of technical topics to let you test your knowledge.",
            contact: {
                name: "COMP-4537 Team S2"
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocs));

db.promise = sql => {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) {
                reject(new Error());
                return;
            }
            resolve(result);
        })
    })
}

app.use((req, res, next) => {
    res.header('Content-Type', 'text/html');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

// Get request (ALL) or By Category
/**
 * @swagger
 * /API/v1/questions:
 *  get:
 *      description: Used to get all questions or all questions in a specific category.
 *      parameters:
 *          - name: category
 *            in: query
 *            required: false
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 */
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
/**
 * @swagger
 * /API/v1/questions/{id}:
 *  get:
 *      description: Used to get a question by its id.
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 */
app.get(getQuestionByIDEndPoint, (req, res) => {
    if (isNaN(req.params.id)) {
        res.statusCode = 400;
        res.header('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Incorrect request body"}))
        return
    }
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
/**
 * @swagger
 * /API/v1/stats:
 *  get:
 *      description: Used to get all the statistics for all the endpoints.
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 */
app.get(getStatsEndPoint, (req, res) => {
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    res.end(JSON.stringify(endpointStats));
})

/**
 * @swagger
 * /API/v1/login:
 *  post:
 *      description: Used to post a login request.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The user's username
 *                              example: admin
 *                          password:
 *                              type: string
 *                              description: The user's password
 *                              example: 1234abcd
 *      responses:
 *          "200":
 *              description: Successfully made the POST request.
 *          "401":
 *              description: Login has failed. User unauthorized to make POST request.
 */
app.post(loginEndPoint, (req, res) => {
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
    let body = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const loginCredentials = JSON.parse(body);
        if (typeof(loginCredentials.username) != 'string' && typeof(loginCredentials.password) != 'string') {
            res.statusCode = 400;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Incorrect request body"}))
            return
        }
        db.connect(() => {
            db.query(`SELECT * FROM user WHERE username = '${loginCredentials.username}'`, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                if (Array.isArray(result) && result.length !== 0) {
                    bcrypt.compare(loginCredentials.password, result[0].password, (err, result) => {
                        if (err) {
                            console.error(err);
                            throw err;
                        }
                        res.statusCode = 200;
                        res.header('Content-Type', 'application/json');
                        res.end(JSON.stringify({ authorized: result }));
                    })
                } else {
                    res.statusCode = 401;
                    res.header('Content-Type', 'application/json');
                    res.end(JSON.stringify({ authorized: false }));
                }
            })
        })
    })
})

/**
 * @swagger
 * /API/v1/scores:
 *  get:
 *      description: Used to get all player scores.
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 */
app.get(AllScoresEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            endpointStats.find(obj => obj.endpoint === AllScoresEndPoint && obj.requests++);
            res.end(JSON.stringify(result));
        })
    })
})

/**
 * @swagger
 * /API/v1/scores:
 *  post:
 *      description: Used to post a logged in user's score.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          uuid:
 *                              type: string
 *                              description: The user's uuid
 *                              example: 560a559e-7c20-4e6a-9d43-80e0ec3a4f59
 *                          name:
 *                              type: string
 *                              description: The user's name
 *                              example: Alkarim
 *                          highscore:
 *                              type: integer
 *                              description: The user's score
 *                              example: 300
 *      responses:
 *          "200":
 *              description: Successfully made the POST request.
 *          "401":
 *              description: User is unauthorized and unable to make POST request.
 */
app.post(AllScoresEndPoint, (req, res) => {
    let body = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const userCredentials = JSON.parse(body);
        console.log(userCredentials);

        if (typeof(userCredentials.uuid) != 'string' || typeof(userCredentials.uuid) != 'string' || typeof(userCredentials.score) != 'number') {
            res.statusCode = 400;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Incorrect request body"}))
            return
        }
        db.connect(() => {
            db.query(`INSERT INTO score (uuid, name, highscore) VALUES ('${userCredentials.uuid}', '${userCredentials.name}', '${userCredentials.highscore}')`, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.endpoint === AllScoresEndPoint && obj.method === 'POST' && obj.requests++);
                res.end(JSON.stringify(result));
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

