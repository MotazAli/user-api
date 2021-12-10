const express = require('express')
const userService = require('./services/user_service')
const userRouter = require('./routers/user_router')
const { authorization } = require('./utilities/auth')
const app = express()
const PORT = 3000


app.use(express.json())
app.use(authorization)

app.use('/users',userRouter)
app.get('/', async(req,res) => res.sendStatus(200))


app.listen(PORT, async () => {
    console.log(`Sender Auth app listening at http://localhost:${PORT}`)
    await userService.handleUserUpdatedConsumer()
})