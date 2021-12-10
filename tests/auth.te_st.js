const {authorization} = require('../utilities/auth')
const Session = require('../db/schema/session')
const {getFromCache} = require('../utilities/cache')
jest.mock('../db/schema/session',() => ({
    findOne : (query) =>{
        return Promise.resolve( {
            id:'fwefsf:324sfdfa:423asas',
            token:'dfsdfsdf:sfsdvdbefg:sdgdfgfd'
        })
    }
}))

jest.mock('../utilities/cache',() => ({
    ...jest.requireActual('../utilities/cache'),
    getFromCache : jest.fn().mockImplementation(
        (key,callback) =>{
            return true
        }
    ) 
}))

// jest.mock('../db/schema/session',()=>{
//     return function findOne(){
//         return Promise.resolve( {
//             id:'fwefsf:324sfdfa:423asas',
//             token:'dfsdfsdf:sfsdvdbefg:sdgdfgfd'
//         })
//     } 
// })

// test('authorization contain token => expect working',async()=>{
//     const fakeRequest = {
//         headers:{authorization:'brear dfsdfsdf:324dssdfdfsd:454wefsdfsd'},
//         originalUrl:'users'
//     }
//     const fakeResponse = {
//         sendStatus : (code) =>  code
//     }


//     const fakeNext = () => true

//     //Session.findOne.mockResolvedValue()
//     const result = await authorization(fakeRequest,fakeResponse,fakeNext)
//     expect(result).toBe(true)
// })


test('authorization contain no token => expect not working and return code 401',async()=>{
    const fakeRequest = {
        headers:{},
        originalUrl:'users'
    }
    const fakeResponse = {
        sendStatus : (code) =>  code
    }

    const fakeNext = () => true
    const result = await authorization(fakeRequest,fakeResponse,fakeNext)
    expect(result).toBe(401)
})

test('authorization contain ignore for some url => expect working ',async ()=>{
    const fakeRequest = {
        headers:{},
        originalUrl:'registration'
    }
    const fakeResponse = {
        sendStatus : (code) =>  code
    }

    const fakeNext = () => true
    const result = await authorization(fakeRequest,fakeResponse,fakeNext)
    expect(result).toBe(true)
})