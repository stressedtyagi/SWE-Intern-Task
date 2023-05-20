const express = require("express");
const client = require("prom-client");
const router = express.Router();

const register = new client.Registry();

/* Define a route for the Prometheus metrics endpoint */
router.get("/", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
});

/* Define a histogram to measure the response time of REST API requests */
const restResponseTimeHistogram = new client.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "REST API response time in seconds",
    labelNames: ["method", "route", "code"],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10], // 0.1 to 10 seconds
});

/* Define a histogram to measure the response time of database requests */
const databaseResponseTimeHistogram = new client.Histogram({
    name: "db_response_time_duration_seconds",
    help: "Database API response time in seconds",
    labelNames: ["operation", "success"],
});

/* Define a gauge to measure the number of requests currently being processed */
const inProcessRequests = new client.Gauge({
    name: "rest_request_in_process",
    help: "Number of requests in process",
});

const outliterCounter = new client.Counter({
    name: "rest_outlier_transaction_total",
    help: "Counting transctions whose value is gt 10^10",
});

/* Register the metrics with the Prometheus registry */
register.registerMetric(restResponseTimeHistogram);
register.registerMetric(databaseResponseTimeHistogram);
register.registerMetric(inProcessRequests);
register.registerMetric(outliterCounter);

module.exports = {
    restResponseTimeHistogram,
    databaseResponseTimeHistogram,
    inProcessRequests,
    outliterCounter,
    router,
};
