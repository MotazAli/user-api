const jwt = require('jsonwebtoken')
const { getUserTypeName } = require('../db/schema/user_type')

const SECRET = "Sender secret key from aion company"
const generateToken = (user) => {
    const user_type_name = getUserTypeName(user.userTypeId)
    const token = jwt.sign(
          { user_id: user.id, user_type:user_type_name  },
          SECRET,
          {
            expiresIn: '9999 years',
          }
        )
        return token
}

module.exports = {generateToken}