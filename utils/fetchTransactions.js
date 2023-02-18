const { MongoClient } = require("mongodb");
const axios = require("axios");

const apiKey = process.env.ETHERSCAN_API_KEY;
const apiEndPoint = process.env.API_ENDPOINT;
const dbEndPoint = process.env.DB_ENDPOINT;
const dbName = "koinx-task";

const mongoDBClient = new MongoClient(dbEndPoint);

/**
 * Handles /transaction route and saves all transactions of an account number in DB.
 * @param userAddress : user address used for fetching the transactions
 * @returns Successful message for saving all the transcations back to mongoDB Server
 */
async function fetchTransactions(userAddress) {
    const url = `${apiEndPoint}?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data.result;

    console.log(
        `Fetched total ${data.length} transactions for account: ${userAddress}`
    );

    const db = mongoDBClient.db(dbName);
    const collection = db.collection("transactions");

    const dbData = await collection.findOneAndUpdate(
        {
            userAddress,
        },
        {
            $set: { transactions: data },
        },
        {
            upsert: true,
            returnDocument: "after",
        }
    );
    console.log(
        `Saved total ${dbData.value.transactions.length} transactions for account: ${dbData.value.userAddress}`
    );

    return dbData.value;
}

module.exports = { fetchTransactions };
