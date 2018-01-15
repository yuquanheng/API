const DATABASE = require('../SqlConfig/OperData');
const ArryToSqlString = require('../Util/SqlArry');
let config = {
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
	
	
  }

  async get(id, params) {
    
    let mysqlconfig = Object.assign({}, config);
	mysqlconfig.sqlstring = 'select pName,pver,purl,pdesp,pSize,pType,DATE_FORMAT(pTime,"%Y-%m-%d %T") as pTime from  `apk_package` order by pTime desc';
    let resolut = await DATABASE(mysqlconfig);
    return resolut;
  }

  async create(data, params) {
     
	
    return [data];
  }

  async patch(id, data, params) {
    console.log("patchpatchpatchpatchpatchpatchpatchpatch");
    const message = await this.get(id);
    return Object.assign(message, data);
  }

  async remove(id, params) {
	
    let arrs = id.split(",");
    let ptimes =  ArryToSqlString(arrs); 
    let mysqlconfig = Object.assign({}, config);
	mysqlconfig.sqlstring ="delete from apk_package where pTime in("+ptimes+")"; 
    console.log("removeremoveremoveremoveremoveremove:"+mysqlconfig.sqlstring);
	let resolut = await DATABASE(mysqlconfig);
    return resolut;
  }
}

module.exports = Messages;