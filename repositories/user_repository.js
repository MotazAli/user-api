const Session = require('../db/schema/session')
const {StatusType,STATUSTYPES} = require('../db/schema/status_type')
const User = require('../db/schema/user')
const UserStatus = require('../db/schema/user_status')
const {UserType, USERTYPES} = require('../db/schema/user_type')
const { getFromCache, setInCache } = require('../utilities/cache')
const { generateToken } = require('../utilities/token')
const { generatedRandumSixDigits } = require('../utilities/utility')





const getUsers = async (isDeleted = null,userTypeId = null) => { 
    let query = {}
    if(isDeleted != null) { query['isDeleted'] = isDeleted }
    if(userTypeId != null) { query['userTypeId'] = userTypeId }
    await User.findAll({where : query})
}



const updateUser = async (user) => { 
      const oldUser = await getUserById(user.id)
      oldUser.fullname = user.fullname || oldUser.fullname
      oldUser.firstName = user.firstName || oldUser.firstName
      oldUser.familyName = user.familyName || oldUser.familyName
      oldUser.email = user.email || oldUser.email
      oldUser.mobile = user.mobile || oldUser.mobile
      oldUser.password = user.password || oldUser.password
      oldUser.address = user.address || oldUser.address
      oldUser.nationalNumber = user.nationalNumber || oldUser.nationalNumber
      oldUser.stcPay = user.stcPay || oldUser.stcPay
      oldUser.image = user.image || oldUser.image
      oldUser.gender = user.gender || oldUser.gender
      oldUser.countryId = user.countryId || oldUser.countryId
      oldUser.cityId = user.cityId || oldUser.cityId
      oldUser.userTypeId = user.userTypeId || oldUser.userTypeId
      oldUser.isDeleted = user.isDeleted || oldUser.isDeleted
      oldUser.coreUserId = user.coreUserId || oldUser.coreUserId
      oldUser.supportUserId = user.supportUserId || oldUser.supportUserId
      await oldUser.save()
      return oldUser
}

const deleteUser = async(id) => {
    let user  = await getUserById(id)
    if(user == null || user === undefined) return null;
    user.isDeleted = true
    user.statusTypeId = STATUSTYPES.STOPPED
    await user.save()
    return user
}


const getUserTypes = async()=> await UserType.findAll()


const getUsersStatus =async(isCurrent) =>{
     
    if(isCurrent != null){
        return await UserStatus.findAll({where:{ isCurrent:isCurrent}})
        
    } else {
        return await UserStatus.findAll()
    }  
}


const getUserStatus = async(userId,isCurrent)  =>{

    let whereQuery = {}
    if(isCurrent == null || isCurrent === undefined  ){
        whereQuery = {userId : userId}
    } else {
        whereQuery = {userId : userId , isCurrent: isCurrent }
    }

    return await UserStatus.findAll({ where: whereQuery , include:[ {model : StatusType} ]  }) //UserType.findAll()
    
}




const insertUser = async (user) => {
    if(user == null || user === undefined){ return null}

    user.password = generatedRandumSixDigits().toString()
    const insertedUser = await User.create(user)
    const generatedToken = generateToken(insertedUser)
    let newSession = { user_id : insertedUser.id, token:generatedToken }
    const insertedSession = await Session.create(newSession)
    let newUserStatus = {userId :insertedUser.id , statusTypeId: STATUSTYPES.NEW ,isCurrent :true , description : 'new register user' }
    let insertedUserStatus = await UserStatus.create(newUserStatus)

    if(USERTYPES.CAPTAIN || USERTYPES.AGENT)
    {
        const reviewingUserStatus = await updateUserStatus(insertedUser.id,STATUSTYPES.REVIEWING,"user under reviewing")
        insertedUserStatus = reviewingUserStatus
    }

    let finalUser = insertedUser.dataValues
    finalUser['session'] = insertedSession
    finalUser['status'] = insertedUserStatus
    return finalUser
}

//loginInfo in case captain it will be {mobile, password}
//in case other will be {email , password} 
const login = async (loginInfo) => {
    try {
         let user = await User.findOne({ where: loginInfo , 
            include:[ 
                {model : UserType},
                {model : UserStatus, as: 'status' , where : {isCurrent : true},required: false} // required = false means its a left join
            ]   
        })
         if( user == null || user === undefined){ return user }

         
    //      console.log(user)
         let finalUser = user.dataValues
         finalUser.session = await  Session.findOne({where:{ userId: user.id }})

         getFromCache(finalUser.session.token , (err,reply)=>{
               if(reply == null || reply === undefined){
                    setInCache(finalUser.session.token,true)
               }
         })
         return finalUser
          
    } catch (error) {
        console.log(error)
          return null
    }


}



const getUserById = async (id)=> await User.findOne({where:{ id}})


const getUserByCoreUserId = async (coreUserId)=> await User.findOne({where:{ coreUserId:coreUserId}})


const getUserBySupportUserId = async (supportUserId)=> await User.findOne({where:{ supportUserId:supportUserId}})
     




const updateUserStatus = async (userId,statusTypeId,description = "") => {
    let userStatus = UserStatus.findOne({where: { userId: userId , isCurrent: true}})
    if(userStatus != null ){
        userStatus.isCurrent = false
        await userStatus.save()
    }

    let newUserStatus = { userId:userId ,statusTypeId:statusTypeId , isCurrent: true ,description:description}
    const insertedNewUserStatus = await UserStatus.create(newUserStatus)
    return insertedNewUserStatus
}




module.exports = {
    getUsers,
    getUserById,
    getUserByCoreUserId,
    getUserBySupportUserId,
    insertUser,
    updateUser,
    deleteUser,
    getUserTypes,
    getUserStatus,
    getUsersStatus,
    updateUserStatus,
    login
}
