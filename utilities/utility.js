const fs = require('fs')

const buildURL = (registerObject) => {
    if(registerObject["port"] == null){
        return `${registerObject.protocol}://${registerObject.host}/`
    }
    
    return `${registerObject.protocol}://${registerObject.host}:${registerObject.port}/`
}

const writeFile = (filePath , jsonObj) => {

    fs.writeFileSync(filePath, JSON.stringify(jsonObj),(error) => {
        if(error){
            return false
        }
    })
    return true
}


const generatedRandumSixDigits = () => {
    return  Math.floor(100000 + Math.random() * 900000)
}

const isFileExists = (filePath) => fs.existsSync(filePath)




module.exports = {
    buildURL,
    writeFile,
    isFileExists,
    generatedRandumSixDigits
}