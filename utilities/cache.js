const redis = require('redis')
// local redis
const redisClient = redis.createClient({port:6379, host:'127.0.0.1'})
redisClient.on('error', (err) => {
   console.log('Error occured while connecting or accessing redis server')
})

// for remote redis server 
//const redisClient = redis.createClient({port:14582,host: 'redis-14582.c282.east-us-mz.azure.cloud.redislabs.com' ,password:'hEXNwr1Z6x9lEAz3ulZtHs4UUfxNLLU8' })

// for redis docker
// const redisClient = redis.createClient({
//     host: 'redis_service',
//     port: 6379
// })
redisClient.on('error',(err)=>{
    console.log('error occured while connecting to redids server')
    console.log(err)
})

const setInCache = (key,value) => {
     return redisClient.set(key, value, (err, reply) => {
            if (err) {
                return false
            }

            console.log( " value reply from cache " + reply)
            redisClient.expire(key, 1800); // 1800 seconds means 30 minutes
            return true
        })
    
}

const updateCacheExpiration = (key) => {
    redisClient.expire(key,1800)
}

// const setInCache = (key,value,callback) => {
//     redisClient.set(key,value,callback)
// }


// const getFromCache = (key) => {
//      return redisClient.get(key, (err, reply) => {
//             if (err) {
//                 return false
//             }
//             console.log( " value get from cache " + reply)
//             return reply
//         })
// }

const getFromCache =(key, callback)=> {
    return redisClient.get(key,callback)
}

const deleteEverythingInCache = () =>{
    redisClient.flushdb( function (err, succeeded) {
        console.log(succeeded); // will be true if successfull
    });
}


module.exports = {
    setInCache,
    getFromCache,
    deleteEverythingInCache,
    updateCacheExpiration
}