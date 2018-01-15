const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const auth = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const memory = require('feathers-memory');
const commonHooks = require('feathers-hooks-common');
const swagger = require('feathers-swagger');
const path = require('path');

const apiKey = require('./apiKey');
const anonymous = require('./anonymous');
const MessAge = require('./Route/Message');
const VideoCount = require('./Route/VideoCount');
const ApkPackage = require('./Route/ApkPackage');
const ControllDevice = require('./Route/ControllDevice');
const DeviceReginfo = require('./Route/DeviceReginfo');
const KKST = require('./Route/KKST');
const JumpURL = require('./Route/JumpURL');
const app = express(feathers());
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,x-api-key,Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'find,PUT,POST,GET,DELETE,FIND,OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

app.configure(express.rest());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.configure(auth({ secret: 'secret'}));
app.configure(jwt());
app.configure(
  apiKey({
    header: 'x-api-key',
    allowedKeys: ['opensesame']
  })
);
app.configure(
  anonymous({
    userService: 'users'
  })
);
app.configure(swagger({
    docsPath: '/docs',
	uiIndex: path.join(__dirname, '/public/dist/index.html'),
    info: {
      title: 'A test',
      description: 'A description'
    }
}))

app.use('/users', memory())
   .use('/static', express.static('public'))
   .use('/messages', new MessAge())
   .use('/VideoCount/RequeArray', new VideoCount())
   .use('/ApkPackage/Query', new ApkPackage())
   .use('/PhoneOn', new ControllDevice())
   .use('/DeviceRegInfo', new DeviceReginfo())
   .use('/JumpMessage', new JumpURL())
   .use('/EmitKKST', new KKST())
   .use(express.errorHandler());
const authenticate =()=>
  commonHooks.iff(
    commonHooks.every(commonHooks.isProvider('external')),
    commonHooks.iffElse(
      ctx => {
	   //console.log("CTXCTXCTXTCXCTXCTXTCX:"+JSON.stringify(ctx));	  
	   return ctx.params.headers['x-api-key']||ctx.params.query['x-api-key']||ctx.data['x-api-key']
	  },
      auth.hooks.authenticate('apiKey'),
      auth.hooks.authenticate(['jwt', 'anonymous'])
    )
  );
app.hooks({
  before: {
    all:[authenticate()],
  },
});



app.listen(3030);