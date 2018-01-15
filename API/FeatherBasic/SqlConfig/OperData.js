const ConFig = require('./config');
const BATABASE = require('./DataBase');
const mysql = require('mysql');
const Connection = require('tedious').Connection;
const Promise = require("bluebird");
let BackData = function(json){
	   let ress="";
	   let{databasetype,host,user,password,database,port,sqlstring} = json;
	   let config = ConFig(databasetype,host,user,password,database,port);
	   console.log("shujuleixing:"+JSON.stringify(config));
	   let OperBase = BATABASE(databasetype);
	   let connection ="";
	   if(databasetype == "MySql"){
		   
		  connection = mysql.createConnection(config);
		  ress = OperBase(sqlstring,connection)
		  
	   }
	   else if(databasetype == "SqlServer")
	   {
		  connection = new Connection(config);
		  ress = OperBase(sqlstring,connection);
	   }
	   else
	   {
		   
		   
	   }
	return ress;
} 
module.exports = BackData;