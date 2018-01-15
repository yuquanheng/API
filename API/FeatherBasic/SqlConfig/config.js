let sqlserverconfig = {
  
  userName: 'sa',  
  password: 'xinyun!2#4',  
  server: '220.248.36.100',  
  options : {  
              database:'TrafficDispatch',
              'requestTimeout': 30000			  
            }  

}
let mysqlconfig = {
	
	host     :'mcpoc.cn',
    user     : 'tigase',
    password : 'tigase12',
    database:'tigasedb',
    port:3306
	
}
const setMysqlConfig = function(databasetype,host,user,password,database,port){
    
	let ResolveConfig="";
	console.log("数据库类型:"+databasetype)
    switch(databasetype){
		 case 'MySql':
		  ResolveConfig = {
						host,
						user,
						password,
						database,
						port
					}
		 break;			
		 case 'SqlServer':
		  ResolveConfig = {
					  server:host,
					  userName:user,
					  password,
					  options:{
						  database,
						  'requestTimeout':30000
					  }
				    }
		 break;			
		  
	}
console.log("返回数据库链接:"+JSON.stringify(ResolveConfig));	
 return ResolveConfig;
} 
module.exports = setMysqlConfig;