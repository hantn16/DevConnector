const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function auth(req,res,next){
    // Get token from header
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({msg:'No token, Authorization denied!'});
    }
    try {
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({msg: 'Token is not valid'});
    }
}