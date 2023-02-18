function authenticateAccount(req, res, next) {
    const { userAddress = "" } = req.query;
    if (userAddress.length == 0) {
        res.status(422).send({
            error: "Account id is required!",
        });

        return;
    }

    next();
}

module.exports = authenticateAccount;
