const router = require("express").Router();

router.route('/').post(function (req,res) {
    res.send("Login route.")
})

module.exports = router