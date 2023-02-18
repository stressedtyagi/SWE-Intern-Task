const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PROM_PORT || 9100;

module.exports = {
    restResponseTimeHistogram: new client.Histogram({
        name: "rest_response_time_duration_seconds",
        help: "REST API response time in seconds",
        labelNames: ["method", "route", "status_code"],
    }),

    databaseResponseTimeHistogram: new client.Histogram({
        name: "db_response_time_duration_seconds",
        help: "Database API response time in seconds",
        labelNames: ["operation", "success"],
    }),

    startMetricsServer: () => {
        const collegeDefaultMetrics = client.collectDefaultMetrics;
        collegeDefaultMetrics();
        app.get("/metrics", async (req, res) => {
            res.set("Content-Type", client.register.contentType);
            return res.send(await client.register.metrics());
        });

        app.listen(PORT, () => {
            console.log(`Metrics sever started at http://localhost:${PORT}`);
        });
    },
};
