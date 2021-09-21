/**
 * author: Martin
 * manage vn post
 */
//grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Constant = require('../common/constant.js');

//define format of Collection
var VnpostSchema = new Schema({
    username         :   {type: String},
    display_time     :   {type: String},    //hour:min
    code             :   {type: String},    //MSBANK
    description         :   {type: String},
    url         :   {type: String}, //link to detail page
    phones         :   [{type: String}],    //list of contact phones
    price         :   {type: String},   //14.3
    is_active         :   {type: Number, default: 1},
    updated_time         :   {type: Number},
    post_date         :   {type: String},   //dd/mm/yyyy
    post_id         :   {type: String},
    expire_date         :   {type: String}, //dd/mm/yyyy
    created_time         :   {type: Number},
    is_expired         :   {type: Number, default: 0},
    volume         :   {type: String},
    type         :   {type: String},    //buy/sell
    show_index: {type: Number, default: 1},     //from 1: top index, post will appear on the top
}, { collection: 'vnpost' });

//the schema is useless so far
//we need to create a model using it
var Vnpost = mongoose.model('Vnpost', VnpostSchema);

//create new document
Vnpost.prototype.create = function(data, resp_func){
    var document = new Vnpost(data);
    document.save(function(err, result){
        if(err) {
            var resp = {
                result : Constant.FAILED_CODE,
                message: Constant.SERVER_ERR,
                err: err
            };
            resp_func(resp);
        }else{
            var resp = { result : Constant.OK_CODE };
            resp_func(resp);
        }
    });
};
//
Vnpost.prototype.getAll = function(resp_func){
    Vnpost.find('').exec(function(err, res) {
        if (err) {
            var resp = {
                result : Constant.FAILED_CODE,
                message : Constant.SERVER_ERR,
                name: err.name,
                kind: err.kind
            };
            resp_func(resp);
        } else {
            var resp = {
                result : Constant.OK_CODE,
                data : res
            };
            resp_func(resp);
        }
    });
};
//
Vnpost.prototype.search_by_condition = function(condition, paging, fields, sort, resp_func){
    Vnpost.find(condition).limit(paging.limit).skip(paging.skip).select(fields).sort(sort).exec(function(err, res) {
        if (err) {
            var resp = {
                result : Constant.FAILED_CODE,
                message : Constant.SERVER_ERR,
                name: err.name,
                kind: err.kind
            };
            resp_func(resp);
        } else {
            var resp = {
                result : Constant.OK_CODE,
                data : res,
                skip : paging.skip
            };
            resp_func(resp);
        }
    });
};
//
Vnpost.prototype.update = function(existed_condition, update_data, resp_func){
    var options = { upsert: false };
    Vnpost.update(existed_condition, update_data, options, function(err, numAffected){
        // numAffected is the number of updated documents
        if(err) {
            var resp = {
                result : Constant.FAILED_CODE,
                message: Constant.SERVER_ERR,
                err: err
            };
            resp_func(resp);
        }else{
            var resp = {
                result : Constant.OK_CODE
            };
            resp_func(resp);
        }
    });
};
//
Vnpost.prototype.search_no_paging = function(condition, fields, sort, resp_func){
    Vnpost.find(condition).select(fields).sort(sort).exec(function(err, res) {
        if (err) {
            var resp = {
                result : Constant.FAILED_CODE,
                message : Constant.SERVER_ERR,
                name: err.name,
                kind: err.kind
            };
            resp_func(resp);
        } else {
            var resp = {
                result : Constant.OK_CODE,
                data : res,
            };
            resp_func(resp);
        }
    });
};


module.exports = Vnpost;
