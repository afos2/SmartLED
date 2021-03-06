var express = require('express')
var router = express.Router();
var rp = require('request-promise');
var TokenController = require('../bin/token');
var config = require('../config');
var db = require('../db');

var ColorPicker = class extends TokenController {
	constructor() {
		super();
	}

	colorSelect(req, res, next){
    var self = this;
    var user = db.users.findById(req.get('user'), function(err, user) {
      if (err) { 
        res.send("unauthorized"); 
      } else {
        Promise.resolve(self.getToken()).then((tokenData)=>{

          var body = {
            'access_token': JSON.parse(tokenData).access_token,
            'args': req.query.color,
          };

          var options = {
            uri: config.baseAPI+'/v1/devices/'+config.deviceID+'/color',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: body
          }
          rp(options).then((rtn)=>{
            res.json(rtn);
          }).error((err)=>{
            res.json(err);
          });
          
        }).catch((err)=>{
          res.json(err);
        }); 
      }
    }); 
	}
}

var controller = new ColorPicker();

router.post('/', controller.colorSelect.bind(controller));  

module.exports = router;
