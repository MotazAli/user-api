const userRepository = require('../repositories/user_repository')
const rabbitmq = require('../utilities/rabbitmq')
const {STATUSTYPES} = require('../db/schema/status_type')

const getUsers = async () => await userRepository.getUsers()

const getUserById = async (id) => await userRepository.getUserById(id)

const getUserBySupportUserId = async (supportUserId) => await userRepository.getUserBySupportUserId(supportUserId)

const getUserByCoreUserId = async (coreUserId) => await userRepository.getUserByCoreUserId(coreUserId)

const updateUser = async (user) => await userRepository.updateUser(user)

const deleteUser = async(id) => await userRepository.deleteUser(id)

const getUserTypes = async() => await userRepository.getUserTypes()

const getUsersStatus = async (isCurrent) => await userRepository.getUsersStatus(isCurrent)

const getUserStatus = async (userId,isCurrent) => await userRepository.getUserStatus(userId,isCurrent)

const updateUserStatus = async (userId,statusTypeId) => await userRepository.updateUserStatus(userId,statusTypeId) 

const addUser = async (user) => await userRepository.insertUser(user)

const login = async (loginInfo)=> await userRepository.login(loginInfo)

const acceptUser = async (id) =>{ 
      const user = await getUserById(id)
      if(user == null || user === undefined){return null}
      const insertedUserStatus =  await userRepository.updateUserStatus(userId,STATUSTYPES.WORKING) 
      if(insertedUserStatus != null){
            user['statusTypeId'] = insertedUserStatus.statusTypeId
            rabbitmq.send(rabbitmq.QUEUE_NAMES.MESSAGE_SERVICE_ACCEPTED_USER,insertedUserStatus)
      }
}
const addUserAndPublish = async (user) => {
      const insertedUser = await userRepository.insertUser(user)
      if(insertedUser != null)
      {
             rabbitmq.send(rabbitmq.QUEUE_NAMES.CORE_SERVICE_NEW_USER,insertedUser)
             rabbitmq.send(rabbitmq.QUEUE_NAMES.SUPPORT_SERVICE_NEW_USER,insertedUser)
             rabbitmq.send(rabbitmq.QUEUE_NAMES.MESSAGE_SERVICE_NEW_USER,insertedUser)
      }
      return insertedUser
}

const deleteUserAndPublish = async(id) => { 
      const deletedUser = await userRepository.deleteUser(id)
      if(deletedUser != null)
      {
            rabbitmq.send(rabbitmq.QUEUE_NAMES.CORE_SERVICE_DELETE_USER,deletedUser)
            rabbitmq.send(rabbitmq.QUEUE_NAMES.SUPPORT_SERVICE_DELETE_USER,deletedUser)
      }
      return deletedUser;
}

const updateUserAndPublish = async (user) => {
      const updatedUser =  await userRepository.updateUser(user)
      if(updatedUser != null)
       {
            rabbitmq.send(rabbitmq.QUEUE_NAMES.CORE_SERVICE_UPDATE_USER,updatedUser)
            rabbitmq.send(rabbitmq.QUEUE_NAMES.SUPPORT_SERVICE_UPDATE_USER,updatedUser)
       }
       return updatedUser;
 }

 const handleUserUpdatedConsumer = async ()=>{
       const channel = await rabbitmq.consume(rabbitmq.QUEUE_NAMES.CORE_SERVICE_UPDATE_USER, async (data) => {
             const updatedUser = await updateUser(data)
       })

       const channel = await rabbitmq.consume(rabbitmq.QUEUE_NAMES.SUPPORT_SERVICE_UPDATE_USER, async (data) => {
            const updatedUser = await updateUser(data)
      })

      
 }


module.exports = {
      getUsers,
      getUserById,
      getUserByCoreUserId,
      getUserBySupportUserId,
      addUser,
      addUserAndPublish,
      updateUser,
      updateUserAndPublish,
      deleteUser,
      deleteUserAndPublish,
      getUserTypes,
      getUserStatus,
      getUsersStatus,
      updateUserStatus,
      login,
      acceptUser,
      handleUserUpdatedConsumer
  }
