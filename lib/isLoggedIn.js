const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    let token = ""
    let authToken = req.header("Authorization");
    console.log(authToken);

    if (authToken){
        authToken = authToken.replace("Bearer ", "");
        console.log(authToken);
        token = authToken;
    }

    if (!authToken){
        return res.json({"message": "You cannot access this page because you are not logged in!"})
    }

    try {
        const decoded = jwt.verify(token, "SUPERSECRET");
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({"message": "Your token is invalid!"})
    }
}