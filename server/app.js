const express = require('express');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const PORT = process.env.PORT ||3000;
const app = express();

// Endpoints
const getAllEndPoint = '/API/v1/questions';
const getQuestionByIDEndPoint = '/API/v1/questions/:id'
const getStatsEndPoint = '/API/v1/stats';
const loginEndPoint = '/API/v1/login';
const AllScoresEndPoint = '/API/v1/scores';
const getScoresByUUIDEndPoint = '/API/v1/scores/:uuid';

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
        method: 'GET',
        endpoint: getScoresByUUIDEndPoint.replace(':', ''),
        requests: 0
    },
    {
        method: 'POST',
        endpoint: AllScoresEndPoint,
        requests: 0
    }
];

// const PORT = process.env.PORT || 8888;
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
            title: "[Team S2] Quiz API",
            description: "A simple Express Quiz API that provides questions and answers on a wide variety of technical topics to let you test your knowledge.",
            contact: {
                name: "COMP-4537 [Team S2]"
            },
            servers: ["http://localhost:3000"]
            // servers: ["https://api4537.azurewebsites.net"]          
        }
    },
    apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/4537/termproject/API/V1/documentation', swaggerUi.serve);
app.get('/4537/termproject/API/V1/documentation', swaggerUi.setup(swaggerDocs));

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
 *                  If a category has not been specified, the request will return an array of all the quiz questions with their possible answers.
 *                  If a category has been specified, the request will return an array of the quiz questions in that category with their possible answers.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  question:
 *                                      type: string
 *                                      example: What is the result of 0.1 + 0.2 === 0.3 in JavaScript?
 *                                  choice1:
 *                                      type: string
 *                                      example: 'true'
 *                                  choice2:
 *                                      type: string
 *                                      example: 'false'
 *                                  choice3:
 *                                      type: string
 *                                      example: undefined
 *                                  choice4:
 *                                      type: string
 *                                      example: 'null'
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *                                  answer:
 *                                      type: integer
 *                                      example: 2
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
 *                  The request will return the question object with the specified id.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 1
 *                                  question:
 *                                      type: string
 *                                      example: What is the result of 0.1 + 0.2 === 0.3 in JavaScript?
 *                                  choice1:
 *                                      type: string
 *                                      example: 'true'
 *                                  choice2:
 *                                      type: string
 *                                      example: 'false'
 *                                  choice3:
 *                                      type: string
 *                                      example: undefined
 *                                  choice4:
 *                                      type: string
 *                                      example: 'null'
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *                                  answer:
 *                                      type: integer
 *                                      example: 2
 *          "400":
 *              description: Unable to make the GET request.
 *                  The id that has been passed does not match the format we have defined.
 *                  The id should be an integer (ex. 1, 2, 14, etc.).
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Incorrect request body
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
 *                  This request will return an array with the statistics about each of our API endpoints.
 *                  Each object in the array contains the request method, the request endpoint, and how many requests have been made to that endpoint during the lifetime of the server.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  method:
 *                                      type: string
 *                                      example: GET
 *                                  endpoint:
 *                                      type: string
 *                                      example: API/v1/questions
 *                                  requests:
 *                                      type: integer
 *                                      example: 1
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
 *                  The response from the POST request is a boolean called "authorized" that shows whether or not the user is authorized or not.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              authorized:
 *                                  type: boolean
 *          "400":
 *              description: Unable to make the POST request because of an incorrect request body.
 *                  This could be because of a missing username or password field, having extra fields,
 *                  or by sending the wrong type in the request body.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Incorrect request body
 *          "401":
 *              description: Login has failed. User's credentials are incorrect and is unauthorized to make the POST request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              authorized:
 *                                  type: boolean
 *                                  example: false
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
 *                  This request will return an array of all the user highscores.
 *                  Each object in the array will have an id, a user id, the user's name, and the user's highscore.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 2
 *                                  uuid:
 *                                      type: string
 *                                      example: 560a559e-7c20-4e6a-9d43-80e0ec3a4f59
 *                                  name:
 *                                      type: string
 *                                      example: Alkarim
 *                                  highscore:
 *                                      type: integer
 *                                      example: 200
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

app.get(getScoresByUUIDEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score WHERE uuid = '${req.params.uuid}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            res.statusCode = 200;
            res.header('Content-Type', 'application/json');
            endpointStats.find(obj => obj.endpoint === getScoresByUUIDEndPoint && obj.requests++);
            res.end(JSON.stringify(result));
        })
    })
})

/**
 * @swagger
 * /API/v1/scores:
 *  post:
 *      description: Used to post a logged in user's score or get a user's scores by their uuid.
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
 *                              required: true
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
 *                  The response for the POST request is the stringified response from the mySQL database after the new row has been inserted or an array of score objects pertaining to the given UUID.
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              type: object
 *                              properties:
 *                                  fieldCount:
 *                                      type: integer
 *                                      example: 0
 *                                  affectedRows:
 *                                      type: integer
 *                                      example: 1
 *                                  insertId:
 *                                      type: integer
 *                                      example: 11
 *                                  serverStatus:
 *                                      type: integer
 *                                      example: 2
 *                                  warningCount:
 *                                      type: integer
 *                                      example: 0
 *                                  message:
 *                                      type: string
 *                                      example: ''
 *                                  protocol41:
 *                                      type: boolean
 *                                  changedRows:
 *                                      type: integer
 *                                      example: 0
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                                      example: 2
 *                                  uuid:
 *                                      type: string
 *                                      example: 560a559e-7c20-4e6a-9d43-80e0ec3a4f59
 *                                  name:
 *                                      type: string
 *                                      example: Alkarim
 *                                  highscore:
 *                                      type: integer
 *                                      example: 200
 *          "400":
 *              description: Unable to make the POST request because of an incorrect request body.
 *                  This could be because of either a missing uuid, name, or highscore field in the request body.
 *                  The error could also be caused by having extra fields in the request body.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Incorrect request body
 */
app.post(AllScoresEndPoint, (req, res) => {
    let body = "";
    let sql = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const userCredentials = JSON.parse(body);
        console.log(userCredentials);

        if (Object.keys(userCredentials).length === 1 && 'uuid' in userCredentials) {
            sql = `SELECT * FROM score WHERE uuid = '${userCredentials.uuid}'`
        }

        if (Object.keys(userCredentials).length > 1) {
            sql = `INSERT INTO score (uuid, name, highscore) VALUES ('${userCredentials.uuid}', '${userCredentials.name}', '${userCredentials.highscore}')`
        }

        if (typeof(userCredentials.uuid) != 'string' || userCredentials.name && typeof(userCredentials.name) != 'string' || userCredentials.highscore && typeof(userCredentials.highscore) != 'number') {
            res.statusCode = 400;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Incorrect request body"}))
            return
        }

        db.connect(() => {
            db.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                console.log(sql);
                console.log(result);
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
//     fs.readFile('./assets/questionsv2.json', (err, data) => {
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

app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Listening on port ${PORT}`)
})

