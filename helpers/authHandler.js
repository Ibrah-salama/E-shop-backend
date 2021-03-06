const expressJWT = require('express-jwt')

function authJWT(){
    const secret = process.env.ACCESS_TOKEN_SECRET
    const api = process.env.API_URL
    return expressJWT({
        secret ,
        algorithms: ["HS256"],
        isRevoked: isRevoked
    }).unless({
        path: [
            // { url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            // { url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            // { url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']},
            // `${api}/users/login`,
            // `${api}/users/signup`,
            {url: /(.*)/}
            
        ]
    })
}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true)
    }
    done()
}

module.exports = authJWT