// const jwt = require('jsonwebtoken')
const Session = require('../db/schema/session')
// const User = require('../db/schema/user')
// const UserType = require('../db/schema/user_type')
const { getFromCache, updateCacheExpiration } = require('./cache')
const { urlsIgnored } = require('./urls')






// const registerUser = async (user) => {
//       if(user.userTypeId == null || user.userTypeId === undefined){
//             return { error : "user type undefined"}
//       }

//       const insertedUser = await User.create(user)
//       // const insertResult = await User.create(user)
//       // const insertedUser = insertResult.dataValues
//       const generatedToken = generateToken(insertedUser)
//       const newSession = { user_id : insertedUser.id, token:generatedToken }
//       const insertedSession = await Session.create(newSession)
//       let finalUser = insertedUser.dataValues
//       finalUser['session'] = insertedSession
//       return finalUser
// }

// const login = async (loginInfo) => {
//       try {
//            let user = await User.findOne({ where: loginInfo , include:[ {model : UserType} ]   })
//            if( user == null || user === undefined){ return user }

           
//       //      console.log(user)
//            let finalUser = user.dataValues
//            finalUser.session = await Session.findOne({where:{ userId: user.id }})

//            getFromCache(finalUser.session.token , (err,reply)=>{
//                  if(reply == null || reply === undefined){
//                        setInCache(finalUser.session.token,true)
//                  }
//            })

//       //      if(!isTokenSavedInCache(finalUser.session.token)){ setInCache(finalUser.session.token,true)}
           
//            //verifyToken(finalUser.session.token)
//            return finalUser
            
//       } catch (error) {
//             return null
//       }


// //      if(loginInfo.userType === 'admin'){
// //            const email = userType.email
// //            const password = userType.password
          
// //      }
// }





const authorization = async (req, res, next)=>{
    
      // if(req.originalUrl === '/' || 
      // req.originalUrl === '/Users/Login' || 
      // req.originalUrl === '/Users/Logout' || 
      // req.originalUrl.includes('assets')){ 
      //    return next(); 
      // }

      if(isContainSomeIgnoredURLs(req)) { return next()}
      
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if (token === null || token === undefined) {return res.sendStatus(401)} // if there isn't any token
    


      getFromCache(token, async  (err,reply) => {
            if(reply != null){ 
                  updateCacheExpiration(token)
                  return next() 
            }

            if( await isTokenValidFromDatabase(token)){return next()}
            return res.sendStatus(401)
      })

      // if(isTokenValidFromCache(token)){return next()}
      
      

      
}


const isTokenValidFromDatabase = async (token)=>{
      const session = await Session.findOne({ where: { token: token } })
      if(session == null || session === undefined) { return false}

      console.log(" validate and getted from database")
      return true

      // if(session.userId == userId) { return true }

      // return false
}

// const isTokenValidFromCache = (token) => {

//       const value = getFromCache(token)
//       if(value == null || value === undefined){ return false}

//       console.log(" validate and getted from cache")
//       return true
// }

// const isTokenSavedInCache = (token) => isTokenValidFromCache(token)



const isContainSomeIgnoredURLs = (req) =>{

      let isContain = false
      for(let i = 0; i < urlsIgnored.length ; i++){
            const url = urlsIgnored[i]
            if(req.originalUrl.includes(url)){
                  isContain = true
                  break
            }
      }

      return isContain

      // if(req.originalUrl.includes('deleteCache') 
      // || req.originalUrl.includes('registration') 
      // // || req.originalUrl.includes('assets')
      // ){ 
      //    return true 
      // }

      // return false
}

// const getTokenDetails = (token)=>{
//       return jwt.verify(token, SECRET);
//       // console.log(decoded)
// }


module.exports = {authorization }
