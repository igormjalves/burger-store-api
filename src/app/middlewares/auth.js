import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'


export default (req, res, next) => {
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).json({error: 'Token not provided'})
    }

    const token = authToken.split(' ')[1]

    try {
        jwt.verify(token, authConfig.secret, ((err, decode) => {
            if(err) {
                throw new Error()
            }

            req.userId = decode.id
            req.userName = decode.name
            
            return next()
        }))
    } catch (error) {
        return res.status(401).json({ error: 'Token is invalid' })
    }

}