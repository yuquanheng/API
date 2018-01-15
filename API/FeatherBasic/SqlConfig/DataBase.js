var mysql = require('mysql');
var Request = require('tedious').Request;
var Promise = require("bluebird");
const GetOperFunc = function(databasetype){

	if(databasetype.length>0){
		
		if(databasetype == "MySql"){
		
		  return mysqlOperater;
		
		}
		else if(databasetype == "SqlServer"){
		 
		 return sqlserverOperaterforquery
			
		}
	
	}
	else
	{
		return "0"
		
	}
	
}
let mysqlOperater = function(sql,connection){
	
    return  new Promise((resolve,reject)=>{
		
		connection.connect(function(err){
		 if(err){
			 
			reject(err); 
		  }
		});
		connection.query(sql,function(err, rows, fields){
		 if (err){
			 console.log("Mysql读取数据库失败 "+JSON.stringify(err));
			 reject(err)
		 }
		 else
		 {
			resolve(rows);
		 }
		});	
		connection.end(function(err){
		if(err)
		{
			reject(err)
			console.log("关闭失败");
		}
		else
		{
			
			//ResolveConfig="";
			console.log("关闭成功");
		}
		});
			   
		
	})
	
	
}
let sqlserverOperaterforquery = function(sqlselect,connection)
{    
     return  new Promise((resolve,reject)=>{
		 
		     connection.on('connect', function(err){
		      if(err)
			  {
				console.log('connect err:'+err);
	            reject(err); 
			  }
			  else
			  {
				console.log('connect success');
   
			  }
            
              let rows=[]; 
			  request = new Request(sqlselect,function(err, rowCount) {
			  if (err)
			  {
				reject(err); 
				
			  } 
			  else 
			  {
				console.log("the datacounts "+rowCount);
				
			  }
		  
			   connection.close();
			   //ResolveConfig = "";
			   resolve(rows);
			 });

			request.on('row', function(columns) {
			  var row = {};
			  columns.forEach(function(column) {
			   row[column.metadata.colName] = column.value;
			   });
			  rows.push(row);
			 });

			request.on('done', function(rowCount, more) {
			 console.log(rowCount + ' rows returned');
			});

		   connection.execSql(request);


    	  });
		 
	 })
 
}
module.exports = GetOperFunc;