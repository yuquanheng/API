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
    mysqlconfig.sqlstring = "select ML_DevID, ML_State from  dbo.dev_MEIDList where ML_DevID in("+phomes+")";
	let resolut = await DATABASE(mysqlconfig);
    return resolut;
  }
  
  async update(id, params) {
   
    let mysqlconfig = Object.assign({}, config);
	let arrs = id.split(",");
    let phomes =  ArryToSqlString(arrs); 
    mysqlconfig.sqlstring = "update dbo.dev_MEIDList set ML_State =(ML_State+1)%2 where ML_DevID in("+phomes+")";
	let resolut = await DATABASE(mysqlconfig);
    return resolut;
  }
  async create(data, params) {
     
	let arrs = data.phone;
	let mysqlconfig = Object.assign({}, config);
	let phonestring = "";
	let i;
	for(i=0;i<arrs.length-1;i++){
		
		phonestring = phonestring+"(1,'"+arrs[i]+"',1),";
		
	}
	phonestring = phonestring+"(1,'"+arrs[i]+"',1)";
    mysqlconfig.sqlstring = "insert into dbo.dev_MEIDList(Dev_ID,ML_DevID,ML_State)values"+phonestring;
	let resolut = await DATABASE(mysqlconfig);
	
    return resolut;
    

    return message;
  }

  async patch(id, data, params) {
    console.log("patchpatchpatchpatchpatchpatchpatchpatch");
   
    return ['patch'];
  }

  async remove(id,params) {
	  
	let mysqlconfig = Object.assign({}, config);
	let arrs = id.split(",");
    let phomes =  ArryToSqlString(arrs); 
    mysqlconfig.sqlstring = "update dbo.dev_MEIDList set ML_State = 0 where ML_DevID in("+phomes+")";
	let resolut = await DATABASE(mysqlconfig);
    return resolut;  
  }
}

module.exports = Messages;