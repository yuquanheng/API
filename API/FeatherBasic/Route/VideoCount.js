const DATABASE = require('../SqlConfig/OperData');
const ArryToSqlString = require('../Util/SqlArry');
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
    return ['get'];
  }

  async create(data, params) {
     
	let phonestring = ArryToSqlString(data.phone);
	let mysqlconfig = Object.assign({}, config);
	mysqlconfig.sqlstring = "select phone,devid from bit_VideoAccount where phone in("+phonestring+")";
	console.log("视频:"+mysqlconfig.sqlstring);
    let resolut = await DATABASE(mysqlconfig);
    return resolut;
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