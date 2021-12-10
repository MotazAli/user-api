const {generateToken} = require('../utilities/token')

test('generate token from user object', () => {
    const fakeUser = {id: "1adgsg43dsf:4342werws:234dsfsd", userTypeId:1}
    const token = generateToken(fakeUser)
    expect(token).not.toBeNull()
    expect(token).not.toBeUndefined()
    expect(token.length > 0 ).toBe(true)
})