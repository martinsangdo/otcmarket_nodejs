var express = require('express');
var router = express.Router();
var common = require('../common/common.js');
var Constant = require('../common/constant.js');
var Contact = require('../models/Contact.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//save data to DB
router.post('/contact', function(req, res, next) {
  //
  var new_data = {
    email: req.body['email'],
    message: req.body['message'],
    options: req.body['options'],
    device_info: req.body['device_info'],
    is_read         :   false,
    is_deleted      :   false,
    update_count    :   1,
    create_time: new Date(),
    update_time     :   new Date()
  };
  //todo: overwrite data
  var contact = new Contact();
  var condition = {
    email: req.body['email'],
    message: req.body['message'],
    device_info: req.body['device_info']
  };
  contact.search_by_condition(condition, {limit:1, skip:0}, {_id:1,update_count:1}, '', function(doc){
    var existed = doc.data != null && doc.data.length > 0;
    if (existed){
      //update it
      var update_data = {
        options: req.body['options'],
        is_read         :   false,
        is_deleted      :   false,
        update_count    :   doc.data[0]['update_count']>-1?doc.data[0]['update_count']+1:1,
        update_time     :   new Date()
      };
      contact.update({_id:doc.data[0]['_id']}, update_data, function(resp){
        if (resp.result == Constant.OK_CODE){
          res.rest.success({result: Constant.OK_CODE});   //success
        } else {
          res.rest.badRequest({result: Constant.FAILED_CODE, err: resp['err']});   //failed
        }
      });
    } else {
      //insert new one
      contact.create(new_data, function(resp){
        if (resp.result == Constant.OK_CODE){
          res.rest.success({result: Constant.OK_CODE});   //success
        } else {
          res.rest.badRequest({result: Constant.FAILED_CODE});   //failed
        }
      });
    }
  });
});
//
//get contact list from DB
router.get('/contact/list', function(req, res, next) {
  var contact = new Contact();
  contact.getAll(function(resp){
    if (resp.result == Constant.OK_CODE){
      res.rest.success({result: Constant.OK_CODE, list: resp.data});   //success
    } else {
      res.rest.badRequest({result: Constant.FAILED_CODE});   //failed
    }
  });
});

module.exports = router;
