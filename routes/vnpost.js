/**
 * author Martin
 * @type {createApplication}
 */
const express = require('express');
const router = express.Router();
var Common = require('../common/common.js');
const Constant = require('../common/constant.js');

//get latest post
router.get('/paging-list', function(req, res, next) {
    var page_index = parseInt(req.query['page']);
    if (isNaN(page_index) || page_index <= 0){
        page_index = 1;
    }
    page_index = page_index - 1;     //query from 0
    var category_id = req.query['cat_id'];

});


module.exports = router;
