const validator = require("validator")

const singUpValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body

  if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("name should be 3 charectors...!")
  } else if (lastName.length < 3 || lastName.length > 30) {
    throw new Error("name should be 3 charectors...!")
  } else if (!validator.isEmail(emailId)) {
    throw new Error("invalid Email")
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("invalid Password")
  }
}


const updateValidation =(req)=>{
    const {firstName,lastName,emailId,age,gender,about} = req.body 

    const allowedEditFeilds = ["firstName","lastName","emailId","age","gender","about"]

    const isEditAllowed = Object.keys(req.body).every(feild =>allowedEditFeilds.includes(feild))
    return isEditAllowed

}

module.exports = {
  singUpValidation,
  updateValidation,
}
