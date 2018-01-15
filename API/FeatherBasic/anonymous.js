const Strategy = require('passport-custom');

module.exports = opts => {
  return function() {
    const verifier = async (req, done) => {
      
	  //create a new user in the user service
      //mark this user with a specific anonymous=true attribute
      const user = await this.service(opts.userService).create({
        anonymous: true
      });
      
	  console.log("下发TOKEN:"+JSON.stringify(user));
      //authenticate the request with this user
      return done(null, user,{
        userId: user.id,
		expireTime:"1h",
      });
    };

    // register the strategy in the app.passport instance
    this.passport.use('anonymous', new Strategy(verifier));
  };
};
