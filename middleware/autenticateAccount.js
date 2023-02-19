/**
 * This function is a middleware function that is used to authenticate a user account,
 * checks if the userAddress parameter is provided in the request query string
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns null
 */
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
