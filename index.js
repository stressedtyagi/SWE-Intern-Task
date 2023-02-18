require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const responseTime = require("response-time");
const app = express();
const PORT = process.env.PORT || 8001;
const dbEndPoint = process.env.DB_ENDPOINT;
const {
    fetchTransactions,
    startMetricsServer,
    restResponseTimeHistogram,
} = require("./utils");
const authenticateAccount = require("./middleware/autenticateAccount");
const mongoDBClient = new MongoClient(dbEndPoint);

startServer();

app.use(
    responseTime((req, res, time) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: req.statusCode,
                },
                time * 1000
            );
        }
    })
);

app.get("/", (req, res) => {
    res.status(200).send("Koinx SWE Intern task");
});

app.get("/transactions", authenticateAccount, async (req, res) => {
    const { userAddress = "" } = req.query;
    try {
        const data = await fetchTransactions(userAddress);
        res.status(200).json({
            userAddress: data.userAddress,
            transactions: data.transactions,
        });
    } catch (err) {
        console.log(err);
        res.send(501).send({ msg: err });
    }
});

async function startServer() {
    try {
        await mongoDBClient.connect();
        console.log("Connected successfully to mongodb server");

        app.listen(PORT, () => {
            console.log(`Koinx app running on PORT : ${PORT}`);
        });

        startMetricsServer();
    } catch (err) {
        console.error(`Error : ` + err);
    }
}
