var express = require('express')
var router = express.Router();
var rp = require('request-promise');
var TokenController = require('../bin/token');
var config = require('../config');

var RainbowColor = class extends TokenController {
  constructor() {
    super();
  }

  rainbowCycle(req, res, next){
    Promise.resolve(this.getToken()).then((tokenData)=>{

      var body = {
        'access_token': JSON.parse(tokenData).access_token,
        'args': req.query.cycle,
      };

      var options = {
        uri: config.baseAPI+'/v1/devices/'+config.deviceID+'/rainbowCycle',
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

var controller = new RainbowColor();

router.get('/', controller.rainbowCycle.bind(controller));  

module.exports = router;
