const keys = require("./keys");

// Express setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Posrgres setup
const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on("error", () => {
    console.log("LOST PG CONNECTION");
});

pgClient.query("CREATE TABLE IF NOT EXIST VALUES (NUMBER INT) ")
    .catch((err) => {
        console.log(err);
    });

// Redis setup
const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// Express route handler
app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("select * from values");
    res.send(values.row);
});

app.get("/values/current", async (req, res) => {
    redisClient.hgetall("values", (rr, values) => {
        res.send(values)
    });
});

app.post("/values", async (req, res) => {
    const index = req.body.index;
    if(index >= 14) return res.status(422).send("Index is too high");
    redisClient.hset("values", index, "Nothing yet");
    redisPublisher.publish("insert", index);
    pgClient.query("insert into values(number) values($1) ", [index]);

    res.send({working: true});
});

app.listen(5000, () => {
    console.log("Listening port 5000");
    
});