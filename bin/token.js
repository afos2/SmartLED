var router = require('express').Router();
var rp = require('request-promise');
var config = require('../config');

var TokenController = class TokenController {
	constructor() {
	}

	getToken(req, res) {
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
        resolve(rtn);
      }).error((err)=>{
        reject(err);
      })
    });
	}
}

module.exports = TokenController;
