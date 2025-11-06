const jwt = require('jsonwebtoken')

module.exports = (req,res,next)=>{
    const token = req.header('auth-token')

    if(!token) return res.status(401).send("access denied")

        try {
            const verified = jwt.verify(token.token_secret)
            res.userexist = jwt.verified
            next()
        } catch (error) {
            req.status(404).send("invalid token")
            
        }
}