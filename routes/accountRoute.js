const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const util = require("../utilities/")

router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
)
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accountController.accountLogin
)
router.get("/", util.checkLogin, accountController.buildAccountManagement)
router.get("/update", util.checkLogin, accountController.buildAccountUpdate)
router.post("/updateAccountInformation", 
    util.checkLogin,
    regValidate.accountUpdateRules(),
    regValidate.checkAccountUpdateData,
    util.handleErrors(accountController.updateAccount)
)
router.post("/updatePassword", 
    util.checkLogin,
    regValidate.passwordUpdateRules(),
    regValidate.checkPasswordData,
    util.handleErrors(accountController.updatePassword)
)
router.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    return res.redirect("/")
})
module.exports = router