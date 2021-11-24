const router = require('express').Router();
//do all our user stuff inside this router
router.get("/",(req,res)=>{
    res.send('Hey, its user route!')
})

module.exports = router

