var express = require('express');
var router = express.Router();
const os = require("os")

/* GET users listing. */
router.get('/getDataFromPc', function(req, res, next) {
    try{
        const osInformation={
            hostname : os.hostname(),
            type :os.type()
        }
    res.status(200).json(hostname);
    catch (error){
        res.status(500).json(error);
    }
});

module.exports = router;
