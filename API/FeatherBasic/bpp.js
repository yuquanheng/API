const feathers = require('@feathersjs/feathers');
const rest = require('@feathersjs/express/rest');
const hooks = require('feathers-hooks');
const memory = require('feathers-memory');
const Express = require('@feathersjs/express');
const errorHandler = require('@feathersjs/errors/handler');
const auth = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const jwts = require('jsonwebtoken');
const swagger = require('feathers-swagger');
const path = require('path');
const messageService = memory();
 
messageService.docs = {
  description: 'A service to send and receive messages',
  definitions: {
    messages: {
      "type": "object",
      "required": [
        "text"
      ],
      "properties": {
        "text": {
          "type": "string",
          "description": "The message text"
        },
        "useId": {
          "type": "string",
          "description": "The id of the user that sent the message"
        }
      }
    }
  }
};
 
const app = Express(feathers());
  app.use(Express.json())
  .use(Express.urlencoded({ extended: true }))
  .use('/static', Express.static('public'))
  .configure(Express.rest())
  .configure(swagger({
    docsPath: '/docs',
	uiIndex: path.join(__dirname, '/public/dist/index.html'),
    info: {
      title: 'A test',
      description: 'A description'
    }
  }))
  .use('/messages', messageService);
 
app.listen(3030);
console.log('Feathers authentication with local auth started on 127.0.0.1:3030');