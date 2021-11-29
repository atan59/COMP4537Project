// Constants
const express = require('express');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require('crypto').randomBytes(64).toString('hex')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

app.use(cookieParser());

// CORS (with specific domains)
var whitelist = ['http://localhost:3000','http://localhost:3000/4537/termproject/API/V1/documentation', 'https://4537.azurewebsites.net', 'https://s2api4537.azurewebsites.net', 'https://s2api4537.azurewebsites.net/4537/termproject/API/V1/documentation','http://127.0.0.1:5500', 'http://127.0.0.1:5500/4537/termproject/API/V1/documentation', 'http://127.0.0.1:5500/documentation' /** other domains if any */]
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));

// Endpoints
const getAllEndPoint = '/API/v1/questions';
const getStatsEndPoint = '/API/v1/stats';
const loginEndPoint = '/API/v1/login';
const AllScoresEndPoint = '/API/v1/scores';
const getScoresByUUIDEndPoint = '/API/v1/scores/:uuid';
const getScoresByCategoryEndPoint = '/API/v1/scores/categories/:category';
const getScoresByUUIDAndCategoryEndPoint = '/API/v1/scores/:uuid/:category';
const updateScoreByIDEndPoint = '/API/v1/scores/:id';
const getToken = '/API/v1/token';

// Globals
let adminToken = [];
let accessToken = [];
const endpointStats = [
    {
        method: 'GET',
        endpoint: getToken,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: getAllEndPoint,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: AllScoresEndPoint,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: getScoresByUUIDEndPoint,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: getScoresByCategoryEndPoint,
        requests: 0
    },
    {
        method: 'GET',
        endpoint: getScoresByUUIDAndCategoryEndPoint,
        requests: 0
    },
    {
        method: 'POST',
        endpoint: AllScoresEndPoint,
        requests: 0
    },    
    {
        method: 'POST',
        endpoint: loginEndPoint,
        requests: 0
    },
    {
        method: 'PUT',
        endpoint: updateScoreByIDEndPoint,
        requests: 0
    },
    {
        method: 'DELETE',
        endpoint: getScoresByUUIDEndPoint,
        requests: 0
    },
    {
        method: 'DELETE',
        endpoint: getScoresByUUIDAndCategoryEndPoint,
        requests: 0
    }
];

// Establish DB connection
const db = mysql.createConnection({
    host: 'comp4537s2.mysql.database.azure.com',
    user: 's2',
    password: 'P@$$w0rd',
    database: 's2projectdb'
});

// Swagger Options
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
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

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
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
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
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.endpoint === getAllEndPoint && obj.requests++);
                res.end(JSON.stringify(result));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

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
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.get(getStatsEndPoint, (req, res) => {
    if (adminToken.includes(req.headers['set-cookie'])) {
        res.statusCode = 200;
        res.header('Content-Type', 'application/json');
        const adminStats = endpointStats.map(obj => {
            return { ...obj, endpoint: obj.endpoint.replace(/:/g, '') }
        });
        res.end(JSON.stringify(adminStats));
    } else {
        res.statusCode = 401;
        res.header('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
    }
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
    let body = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const loginCredentials = JSON.parse(body);

        let token = jwt.sign({
            data: loginCredentials.username,
        }, TOKEN_SECRET, { expiresIn: 1800 });
        if (typeof (loginCredentials.username) != 'string' && typeof (loginCredentials.password) != 'string') {
            res.statusCode = 400;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Incorrect request body" }))
            return
        }
        adminToken.push(token)

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
                        endpointStats.find(obj => obj.endpoint === loginEndPoint && obj.requests++);
                        res.cookie("jwt", adminToken, { httpOnly: false }).send(JSON.stringify({ authorized: result, jwt: adminToken })).end();
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
 *                  Each object in the array will have an id, a user id, the user's name, the user's highscore, and the category.
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
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.get(AllScoresEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.method === "GET" && obj.endpoint === AllScoresEndPoint && obj.requests++);
                res.end(JSON.stringify(result));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/scores/{uuid}:
 *  get:
 *      description: Used to get all scores for a user with a given UUID.
 *      parameters:
 *          - name: uuid
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 *                  This request will return an array of all the highscores pertaining to a specific uuid (user).
 *                  Each object in the array will have an id, a user id, the user's name, the user's highscore, and the category.
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
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.get(getScoresByUUIDEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score WHERE uuid = '${req.params.uuid}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => {
                    if (obj.method === "GET" && obj.endpoint === getScoresByUUIDEndPoint) {
                        obj.requests++;
                    }
                })
                res.end(JSON.stringify(result));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/scores/categories/{category}:
 *  get:
 *      description: Used to get all scores for a given category.
 *      parameters:
 *          - name: category
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 *                  This request will return an array of all the highscores pertaining to a specific category.
 *                  Each object in the array will have an id, a user id, a user's name, the user's highscore, and the category for the score.
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
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.get(getScoresByCategoryEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score WHERE category = '${req.params.category}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.endpoint === getScoresByCategoryEndPoint && obj.requests++);
                res.end(JSON.stringify(result));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/scores/{uuid}/categories/{category}:
 *  get:
 *      description: Used to get all scores for a user with a given uuid and category.
 *      parameters:
 *          - name: uuid
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: category
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 *                  This request will return an array of all the highscores pertaining to a specific uuid (user) with a specific category.
 *                  Each object in the array will have an id, a user id, a user's name, the user's highscore, and the category for the score.
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
 *                                  category:
 *                                      type: string
 *                                      example: JavaScript
 *          "401":
 *              description: Unable to make the GET request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.get(getScoresByUUIDAndCategoryEndPoint, (req, res) => {
    db.connect(() => {
        db.query(`SELECT * FROM score WHERE uuid = '${req.params.uuid}' AND category = '${req.params.category}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.method === 'GET' && obj.endpoint === getScoresByUUIDAndCategoryEndPoint && obj.requests++);
                res.end(JSON.stringify(result));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/token:
 *  get:
 *      description: Used to get a JWT token to render API services.
 *      responses:
 *          "200":
 *              description: Successfully made the GET request.
 *                  This request will return a JWT token specific to a user that they can use to render API services.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          items:
 *                              type: object
 *                              properties:
 *                                  playerjwt:
 *                                      type: string
 *                                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicGxheWVyIiwiaWF0IjoxNjM4MTYxMDQ4LCJleHAiOjE2MzgxNjI4NDh9.wwwxchdsP6HQDRjXGVYTZ8ENTybd-EUIi88T7BVQtbM
 */
app.get(getToken, (req, res) => {
    let playerToken = jwt.sign({
        data: 'player',
    }, TOKEN_SECRET, { expiresIn: 1800 });
    accessToken.push(playerToken);
    res.statusCode = 200;
    res.header('Content-Type', 'application/json');
    endpointStats.find(obj => obj.method === 'GET' && obj.endpoint === getToken && obj.requests++);
    res.cookie("playerjwt", playerToken, { httpOnly: false }).send(JSON.stringify({ playerjwt: playerToken })).end();
})

/**
 * @swagger
 * /API/v1/scores/{uuid}/{category}:
 *  delete:
 *      description: Used to delete all scores for a user with a given UUID and given category.
 *      parameters:
 *          - name: uuid
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *          - name: category
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: Successfully made the DELETE request.
 *                  This request deletes all of the highscores pertaining to a specific uuid (user) and category and returns the number of affected rows.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              affectedRows:
 *                                  type: integer
 *                                  example: 3
 *          "400":
 *              description: Unable to make the DELETE request because of an incorrect request body.
 *                  This could be because of having the uuid or category in the wrong format.
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
 *              description: Unable to make the DELETE request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.delete(getScoresByUUIDAndCategoryEndPoint, (req, res) => {
    if (req.params.uuid && typeof (req.params.uuid) != 'string' && req.params.category && typeof (req.params.category) != 'string') {
        res.statusCode = 400;
        res.header('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Incorrect request body" }))
        return
    }

    db.connect(() => {
        db.query(`DELETE FROM score WHERE uuid = '${req.params.uuid}' AND category = '${req.params.category}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (req.headers['set-cookie'] == accessToken) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.method === "DELETE" && obj.endpoint === getScoresByUUIDAndCategoryEndPoint && obj.requests++);
                res.end(JSON.stringify({ affectedRows: result.affectedRows }));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/scores/{uuid}:
 *  delete:
 *      description: Used to delete all scores for a user with a given UUID.
 *      parameters:
 *          - name: uuid
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: Successfully made the DELETE request.
 *                  This request deletes all of the highscores pertaining to a specific uuid (user) and returns the number of affected rows.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              affectedRows:
 *                                  type: integer
 *                                  example: 3
 *          "400":
 *              description: Unable to make the DELETE request because of an incorrect request body.
 *                  This could be because of having the uuid in the wrong format.
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
 *              description: Unable to make the DELETE request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.delete(getScoresByUUIDEndPoint, (req, res) => {
    if (req.params.uuid && typeof (req.params.uuid) != 'string') {
        res.statusCode = 400;
        res.header('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Incorrect request body" }))
        return
    }

    db.connect(() => {
        db.query(`DELETE FROM score WHERE uuid = '${req.params.uuid}'`, (err, result) => {
            if (err) {
                console.error(err);
                throw err;
            }
            if (accessToken.includes(req.headers['set-cookie'])) {
                res.statusCode = 200;
                res.header('Content-Type', 'application/json');
                endpointStats.find(obj => obj.method === "DELETE" && obj.endpoint === getScoresByUUIDEndPoint && obj.requests++);
                res.end(JSON.stringify({ affectedRows: result.affectedRows }));
            } else {
                res.statusCode = 401;
                res.header('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
            }
        })
    })
})

/**
 * @swagger
 * /API/v1/scores/{id}:
 *  put:
 *      description: Used to update a specific score for a user.
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                              description: the score of the ID
 *      responses:
 *          "200":
 *              description: Successfully made the PUT request.
 *                  The response from the POST request is a boolean called "authorized" that shows whether or not the user is authorized or not.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              affectedRows:
 *                                  type: integer
 *                                  example: 3
 *          "400":
 *              description: Unable to make the PUT request because of an incorrect request body.
 *                  This could be because of an ID that doesn't exist or if the ID is in the wrong format.
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
 *              description: Unable to make the PUT request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.put(updateScoreByIDEndPoint, (req, res) => {
    if (req.params.id && typeof (req.params.id) != 'string') {
        res.statusCode = 400;
        res.header('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: "Incorrect request body" }))
        return
    }

    let body = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const userBody = JSON.parse(body);

        db.promise(`SELECT * FROM score WHERE id = ${req.params.id}`)
            .then(result => {
                let sql;

                if (result.length === 0) {
                    res.statusCode = 400;
                    res.header('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: `No score found with id: ${req.params.id}` }))
                }
                sql = `UPDATE score SET name = '${userBody.name}' WHERE id = ${result[0].id}`;
                return db.promise(sql);
            }).then(result => {
                if (accessToken.includes(req.headers['set-cookie'])) {
                    res.statusCode = 200;
                    res.header('Content-Type', 'application/json');
                    endpointStats.find(obj => obj.endpoint === updateScoreByIDEndPoint && obj.requests++);
                    res.end(JSON.stringify({ affectedRows: result.affectedRows }));
                } else {
                    res.statusCode = 401;
                    res.header('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
                }
            }).catch(err => console.log(err));
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
 *                  This could be because of either a missing uuid or name field in the request body.
 *                  The error could also be caused by having extra fields in the request body or the uuid or name in the wrong format.
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
 *              description: Unable to make the PUT request because of authorization.
 *                  This is because the user did not send a valid token in the header when making the request.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              error:
 *                                  type: string
 *                                  description: error message
 *                                  example: Not authenticated to start game. Invalid token.
 */
app.post(AllScoresEndPoint, (req, res) => {
    let body = "";
    let sql = "";

    req.on('data', chunk => {
        if (chunk != null) body += chunk;
    })

    req.on('end', () => {
        const userCredentials = JSON.parse(body);

        if (Object.keys(userCredentials).length === 1 && 'uuid' in userCredentials) {
            sql = `SELECT * FROM score WHERE uuid = '${userCredentials.uuid}'`
        }

        if (Object.keys(userCredentials).length > 1) {
            sql = `INSERT INTO score (uuid, name, highscore, category) VALUES ('${userCredentials.uuid}', '${userCredentials.name}', '${userCredentials.highscore}', '${userCredentials.category}')`
        }

        if (typeof (userCredentials.uuid) != 'string' || userCredentials.name && typeof (userCredentials.name) != 'string') {
            res.statusCode = 400;
            res.header('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: "Incorrect request body" }))
            return
        }

        db.connect(() => {
            db.query(sql, (err, result) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
                if (accessToken.includes(req.headers['set-cookie'])) {
                    res.statusCode = 200;
                    res.header('Content-Type', 'application/json');
                    endpointStats.find(obj => obj.endpoint === AllScoresEndPoint && obj.method === 'POST' && obj.requests++);
                    res.end(JSON.stringify(result));
                } else {
                    res.statusCode = 401;
                    res.header('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Not authenticated to start game. Invalid token.'}));
                }
            })
        })
    })
})

app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`Listening on port ${PORT}`)
})

