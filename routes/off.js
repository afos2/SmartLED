var express = require('express')
var router = express.Router();
var rp = require('request-promise');
var TokenController = require('../bin/token');
var config = require('../config');

var OffController = class extends TokenController {
	constructor() {
		super();
	}

	shutOff(req, res, next){
    Promise.resolve(this.getToken()).then((tokenData)=>{
      var access_token = JSON.parse(tokenData).access_token;

      var body = {
        'access_token': access_token,
        'args': 'off',
      };

      var options = {
        uri: config.baseAPI+'/v1/devices/'+config.deviceID+'/off',
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
}

var controller = new OffController();

router.get('/', controller.shutOff.bind(controller));  

module.exports = router;
