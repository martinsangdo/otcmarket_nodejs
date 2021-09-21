const express = require('express');
const router = express.Router();
const Temp = require('../models/Temp.js');
var Common = require('../common/common.js');
const Constant = require('../common/constant.js');
const axios = require('axios');
const cheerio = require('cheerio');

//query latest posts in http://sanotc.com/otc
router.get('/crawl_latest_posts', function(req, res, next) {
      const url = 'http://sanotc.com/otc';
      axios(url)
        .then(response => {
          const html = response.data;
          const $ = cheerio.load(html);
          //selling posts
          const $trs = $('tr', '#otclisting0');
          parseAndSaveSellPosts($, $trs);
          res.rest.success({result: Constant.OK_CODE});   //success
        }).catch(function(err){
          res.rest.success({result: Constant.FAILED_CODE});
        });
});

function parseAndSaveSellPosts($, $html_posts){
  var post_len = $html_posts.length;
  common = new Common();
  common.xlog('sell posts len', post_len);
  for (var i=0; i<post_len; i++){
    parsePostDetail($, $html_posts[i], 'SELL');
  }
}

function parsePostDetail($, $post_detail, post_type){
  common = new Common();
  var code = $('a', $post_detail).text();
  var price = $('', $post_detail).text();
  var volumn = $('', $post_detail).text();
  var time = $('', $post_detail).text();
  var detail_url = $('', $post_detail).text();
  var description = $('', $post_detail).text();
  var create_date = $('', $post_detail).text();
  var expire_date = $('', $post_detail).text();
  var username = $('', $post_detail).text();
  var phone = $('', $post_detail).text();
  var trade_city = $('', $post_detail).text();
  var email = $('', $post_detail).text();
  var user_profile_url = $('', $post_detail).text();



  common.dlog(stock_code);
}

module.exports = router;
