const Strategy = require('passport-custom');
const passport = require('passport');
const decode = require('jwt-decode')
module.exports = opts => {
  return function() {
    const verifier = (req, done) => {

      // get the key from the request header supplied in opts
	  console.log("验证TOKEN");
      const key = req.params.headers[opts.header]||req.params.query[opts.header]||req.body[opts.header];
	  const requestid = req.params;
      console.log("验证TOKEN"+JSON.stringify(req));
	  const payload = decode(key);
	  var newDate = new Date();
	  newDate.setTime(payload.exp* 1000);
	  console.log("过期时间:"+payload.exp);
	  console.log(newDate.toString());
	  //console.log("UserID:"+req.params.query.UserID+" TIOKEN:"+payload.userId);
	  console.log("解析TOKEN:"+JSON.stringify(payload));
      // check if the key is in the allowed keys supplied in opts
      //const match = opts.allowedKeys.includes(key);
      //const match = (payload.userId == req.params.query.UserID);
	  const match = true;
      // user will default to false if no key is present
      // and the authorization will fail
      const user = match ? 'api' : match;
	  
	  console.log("检测匹配:"+JSON.stringify(user));
      return done(null, user);
    };
    // register the strategy in the app.passport instance
    this.passport.use('apiKey', new Strategy(verifier));
  };
};