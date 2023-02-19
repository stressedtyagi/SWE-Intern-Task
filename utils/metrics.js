const express = require("express");
const client = require("prom-client");
const router = express.Router();

const register = new client.Registry();

router.get("/", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
});

const restResponseTimeHistogram = new client.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "REST API response time in seconds",
    labelNames: ["method", "route", "code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

const databaseResponseTimeHistogram = new client.Histogram({
    name: "db_response_time_duration_seconds",
    help: "Database API response time in seconds",
    labelNames: ["operation", "success"],
});

const inProcessRequests = new client.Gauge({
    name: "rest_request_in_process",
    help: "Number of requests in process",
});

register.registerMetric(restResponseTimeHistogram);
register.registerMetric(databaseResponseTimeHistogram);
register.registerMetric(inProcessRequests);

module.exports = {
    restResponseTimeHistogram,
    databaseResponseTimeHistogram,
    inProcessRequests,
    router,
};
