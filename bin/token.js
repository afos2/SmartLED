var router = require('express').Router();
var rp = require('request-promise');
var config = require('../config');
  
var tokenData = {};

var TokenController = class TokenController {
	constructor() {
  }

  isExpired(timestamp) {
    return Date.now()>timestamp;
  }

	getToken() {
    if(!tokenData.expiration || this.isExpired(tokenData.expiration)) {
      return new Promise((resolve, reject)=> {
        var body = {
          'grant_type': 'password',
          'username': config.user,
          'password': config.password,
          'client_id': config.client_id,
          'client_secret': config.client_secret
        }

        var options = {
          uri: config.baseAPI+'/oauth/token',
          method: 'POST',
          headers: {
            'Authorization': 'particle:particle',
            'Content-Type': 'application/json'
          },
          form: body
        }

        rp(options).then((rtn)=>{
          var resp = JSON.parse(rtn);
          resp.expiration = Date.now()+(resp.expires_in*1000);
          tokenData = resp;
          resolve(JSON.stringify(tokenData));
        }).error((err)=>{
          reject(err);
        })
      });
    } else {
      return new Promise((resolve, reject)=>{
        resolve(JSON.stringify(tokenData));
      });
    }
	}
}

module.exports = TokenController;
