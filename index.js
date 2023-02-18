require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8001;
const { fetchTransactions } = require("./utils");

startServer();

app.get("/", (req, res) => {
    res.status(200).send("Koinx SWE Intern task");
});

app.get("/transactions", async (req, res) => {
    const { userAddress = "" } = req.query;
    const data = await fetchTransactions(userAddress);
    res.status(200).json({
        userAddres: data.userAddress,
        transactions: data.transactions,
    });
});

async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Koinx app running on PORT : ${PORT}`);
        });
    } catch (err) {
        console.error(`Error : ` + err);
    }
}
