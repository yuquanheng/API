const DATABASE = require('../SqlConfig/OperData');
const ArryToSqlString = require('../Util/SqlArry');
let config = {
	databasetype:"SqlServer",
	host:"121.41.119.129",
	user:"sa",
	password:"xinyun!2#4",
	database:"TrafficDispatch",
	port:"",
	sqlstring:"select phone,devid from `bit_VideoAccount",
}
class Messages {
  constructor() {
    this.messages = [];
    this.currentId = 0;
  }

  async find(params) {
	   console.log("findfindfindfindfindfindfindfindfind"+JSON.stringify(params));
    return ['find'];
  }

  async get(id, params) {

    let mysqlconfig = Object.assign({}, config);
	let arrs = id.split(",");
    let phomes =  ArryToSqlString(arrs); 
    mysqlconfig.sqlstring = "select CompanyCode,Phone,MEID,IMSI,Version,Location,Active,PhoneID,PhoneStatus,ClientStatus,IPAddress,CONVERT(varchar(100),RegTime, 25) as RegTime,CONVERT(varchar(100),ActiveTime, 25) as ActiveTime,PushURL from dbo.PhoneValidate where phone in("+phomes+") order by ActiveTime desc";
	let resolut = await DATABASE(mysqlconfig);
    return resolut;
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