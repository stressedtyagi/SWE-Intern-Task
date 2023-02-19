require("dotenv").config();
const { MongoClient } = require("mongodb");
const express = require("express");
const responseTime = require("response-time");
const app = express();
const PORT = process.env.PORT || 8001;
const dbEndPoint = process.env.DB_ENDPOINT;
const {
    fetchTransactions,
    metricsRouter,
    restResponseTimeHistogram,
    inProcessRequests,
} = require("./utils");
const authenticateAccount = require("./middleware/autenticateAccount");
const mongoDBClient = new MongoClient(dbEndPoint);

startServer();

app.get("/", (req, res) => {
    res.status(200).send("Koinx SWE Intern task");
});

app.get("/transactions", authenticateAccount, async (req, res) => {
    const end = restResponseTimeHistogram.startTimer();
    const route = req?.route?.path;
    const { userAddress = "" } = req.query;
    try {
        inProcessRequests.inc();
        const data = await fetchTransactions(userAddress);
        res.status(200).json({
            userAddress: data.userAddress,
            transactions: data.transactions,
        });
    } catch (err) {
        console.log(err);
        res.status(501).send({ msg: err });
    } finally {
        inProcessRequests.dec();
        end({ route, code: res.statusCode, method: req.method });
    }
});

app.use("/metrics", metricsRouter);

async function startServer() {
    try {
        await mongoDBClient.connect();
        console.log("Connected successfully to mongodb server");

        app.listen(PORT, () => {
            console.log(`Koinx app started at : http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(`Error : ` + err);
    }
}
