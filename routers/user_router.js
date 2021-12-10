const express = require('express')
const userService = require('../services/user_service')
const userRouter = express.Router()




userRouter.get('/',async (req,res) => { 
    const users = await userService.getUsers()
    res.status(200).send( JSON.stringify(users ) )
})

userRouter.get('/:id',async (req,res) => { 
    const {id} = req.params
    const user = await userService.getUserById(id)
    res.status(200).send( JSON.stringify(user ) )
})

userRouter.put('/:id', async(req,res) => {
    const {id} = req.params
    if(id == null || id === undefined){
        return res.status(503).send( "User id not provided" )
    } 
    const userData = req.body
    userData['id'] = id
    const user = await userService.updateUserAndPublish(userData)
    res.status(200).send( JSON.stringify(user) )
})

userRouter.delete('/:id', async(req,res) => {
    const {id} = req.params
    if(id == null || id === undefined){
        return res.status(503).send( "User id not provided" )
    } 
    const user = await userService.deleteUserAndPublish(id)
    res.status(200).send( JSON.stringify(user))

})


userRouter.get("/types", async(req,res)  =>{
    const allUserTypes=await userService.getUserTypes()
    console.log(allUserTypes)
    res.status(200).send(JSON.stringify(allUserTypes))  
})


userRouter.get('/status',async(req,res) =>{
    let {isCurrent} = req.query
    const usersStatus = await userService.getUsersStatus(isCurrent)
    res.status(200).send(JSON.stringify(usersStatus))
 
})


userRouter.get("/:id/status", async(req,res)  =>{
    const {id} = req.params
    if(id == null || id === undefined){
        return res.status(503).send( "User id not provided" )
    } 
    const {isCurrent} = req.query
    const statusTypes= await userService.getUserStatus(id,isCurrent)
    res.status(200).send(JSON.stringify(statusTypes))
   
})

userRouter.put('/:id/status',async (req,res) => {

    const {id} = req.params
    if(id == null || id === undefined){
        return res.status(503).send( "User id not provided" )
    } 
    const {statusTypeId} = req.body
    const insertedNewUserStatus = await userService.updateUserStatus(id,statusTypeId)
    res.status(200).send(JSON.stringify(insertedNewUserStatus))
})


userRouter.put('/:id/accept',async (req,res) => {

    const {id} = req.params
    if(id == null || id === undefined){
        return res.status(503).send( "User id not provided" )
    } 
    
    const insertedNewUserStatus = await userService.acceptUser(id)
    res.status(200).send(JSON.stringify(insertedNewUserStatus))
})




userRouter.post('/', async (req,res)=>{
    const userInfo = req.body
    const insertedUser = await userService.addUserAndPublish(userInfo)
    res.status(200).send(JSON.stringify(insertedUser));
})

userRouter.post('/register', async (req,res)=>{
    const userInfo = req.body
    const insertedUser = await userService.addUserAndPublish(userInfo)
    res.status(200).send(JSON.stringify(insertedUser));
})


userRouter.post('/login',async (req,res)=>{
    const loginInfo = req.body
    const user = await userService.login(loginInfo)
    res.status(200).send(JSON.stringify(user));
})



module.exports = userRouter
