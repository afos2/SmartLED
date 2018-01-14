var express = require('express')
var router = express.Router();
var rp = require('request-promise');
var TokenController = require('../bin/token');
var config = require('../config');

var BrightnessController = class extends TokenController {
	constructor() {
		super();
	}

	setBrightness(req, res, next){
    Promise.resolve(this.getToken()).then((tokenData)=>{
      var access_token = JSON.parse(tokenData).access_token;

      var body = {
        'access_token': access_token,
        'args': req.query.lvl,
      };

      var options = {
        uri: config.baseAPI+'/v1/devices/'+config.deviceID+'/brightness',
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

var controller = new BrightnessController();

router.post('/', controller.setBrightness.bind(controller));  

module.exports = router;
