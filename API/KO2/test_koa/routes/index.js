const router = require('koa-router')()
const logUtil = require('../utils/log_util');
const send = require('koa-send'); // "koa-send": "^4.1.0"
const Stomp = require('stompjs');
router.get('/', async (ctx, next) => {

   
   console.log("xiafa");
   try{
    console.log("xiafa1");
   let client = Stomp.overTCP('220.248.36.102', 61613);
   console.log("xiafa2");
   client.connect('user', 'password', function(frame) {	  
   console.log("Connected"); 
   client.send("/topic/hello", {},"787878");
   client.disconnect(function() {
		console.log("See you next time!");
   });
     
   },function(error) {
    // display the error's message header:
    console.log("err:"+JSON.stringify(error));
   });
   }catch(err){
	   
	   console.log("3454:"+err);
	   
   }   
   ctx.body = "343";    
})

router.get('/download', async (ctx, next) => {
    var fileName = '1.jpg';
    ctx.attachment(fileName);
	console.log(process.cwd())
    await send(ctx, fileName, { root: process.cwd()+'/public/images'});
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
