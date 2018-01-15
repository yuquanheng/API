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
   
    return "UODATE";
  }
  
  async update(id, params) {
   
    
    return "UODATE";
  }
  async create(data, params) {
     
	let arrs = data.phone;
	let mysqlconfig = Object.assign({}, config);
	let phonestring = "";
	let i;
	for(i=0;i<arrs.length-1;i++){
		
		phonestring = phonestring+"('"+arrs[i]+"',getdate()),";
		
	}
	phonestring = phonestring+"('"+arrs[i]+"',getdate())";
    mysqlconfig.sqlstring = "insert into dbo.SYS_MEIDWhiteLst(MEID,CreateTime)values"+phonestring;
	let resolut = await DATABASE(mysqlconfig);

    return resolut;
    

    return message;
  }

  async patch(id, data, params) {
    console.log("patchpatchpatchpatchpatchpatchpatchpatch");
   
    return ['patch'];
  }

  async remove(id,params) {
	  
	 return ['patch'];
  }
}

module.exports = Messages;