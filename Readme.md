# Koinx-SWE-Intern-Task

This is a Node.js app that is containerized using `Docker` and has `Prometheus` monitoring implemented. Also using `cAdvisor` (container Advisor) for analyzing and exposing resource usage and performance data from running containers.

This REST API provides routes to retrieve Ethereum transactions for a particular user based on their user address.

## **Prerequisites**

You need to have the following installed on your machine:

-   **Docker**
-   **Node.js**

## **Getting Started**

-   To get started with the app, clone the repository to your local machine:

    ```bash
    $ git clone https://github.com/stressedtyagi/SWE-Intern-Task.git
    ```

-   Change into the project directory:

    ```bash
    $ cd SWE-Intern-Task
    ```

-   Create a `.env` file in the root directory with the following variables:

    -   `PORT` : port in which you want to run the server. (default is 8001)
    -   `ETHERSCAN_API_KEY` : Ethercan API_KEY that you will receive after creating account at etherscan
    -   `API_ENDPOINT` : API end point for fetching the user account transactions. Example : ***https://api.etherscan.io/api***
    -   `DB_ENDPOINT` : Mongodb connection string. Local or cloud connection both works. Make sure your db has database named `koinx-task` and collection named `transactions`

-   Run docker-compose build

    ```bash
    $ docker-compose up --build     # for first time/after changes
    $ docker-compuse up             # anytime after build
    ```

> This will start the app on **_http://localhost:8001_**.

> Prometheus monitoring is already implemented in this app. You can view the metrics on **_http://localhost:9090_**.

## **API endpoints**

-   /transactions?account=[account-id]

    > Fetches all transactions of given userAddress from etherscan api and stores it in mongoDB database with respect to particular userAddress

-   /metrics
    > Shows custom and default metrics we get from prometheus

### rateFetchService

> Fetches current ethereum price in INR and stores in database

## **Authors**

-   Your Name - [stressedtyagi](https://github.com/stressedtyagi)
