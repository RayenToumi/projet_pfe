var express = require('express');
var router = express.Router();
const os = require("os")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json("hello pfe 2025");
});

module.exports = router;
