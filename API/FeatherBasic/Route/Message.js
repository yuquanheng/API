const DATABASE = require('../SqlConfig/OperData');
const config = {
	databasetype:"MySql",
	host:"mcpoc.cn",
	user:"tigase",
	password:"tigase12",
	database:"tigasedb",
	port:3306,
	sqlstring:"select phone,devid from `bit_VideoAccount",
}
class Messages {
  constructor() {
    this.messages = [];
    this.currentId = 0;
  }

  async find(params) {
	 console.log("findfindfindfindfindfindfindfindfind");
	 let data = await DATABASE(config);
	
    return data.length;
  }

  async get(id, params) {
   
    console.log("getgetgetgetgetgetgetgetgetgetgetget");
    const message = this.messages.find(message => message.id === parseInt(id, 10));
    if(!message) {
      throw new Error(`Message with id ${id} not found`);
    }
    return ['get'];
  }

  async create(data, params) {
     
	  console.log("createcreatecreatecreatecreatecreate");
    const message = Object.assign({
      id: ++this.currentId
    }, data);

    this.messages.push(message);

    return message;
  }

  async patch(id, data, params) {
    console.log("patchpatchpatchpatchpatchpatchpatchpatch");
    const message = await this.get(id);
    return Object.assign(message, data);
  }

  async remove(id, params) {
    console.log("removeremoveremoveremoveremoveremove");
    const message = await this.get(id);
    const index = this.messages.indexOf(message);
    this.messages.splice(index, 1);
    return message;
  }
}

module.exports = Messages;