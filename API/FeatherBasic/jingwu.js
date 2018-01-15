var express = require('express');
var ConnectionPool = require('../sql/sqltediouspoll');
var Paras = require('../request/ParseRequestBody');
var logger = require('../../util/log').logger;
var Connection = require('tedious').Connection;
var myconnect = require('../sql/dbhelp');
var sqlconfig = require('../sql/sqlconfig');
var EventEmitter = require('events').EventEmitter; 
var eventss = new EventEmitter();
var moment = require('moment');
var schedule = require("node-schedule"); 
var Q = require("q");
var func = {};

String.prototype.trim = function() {
       return this.replace(/^\s+|\s+$/g, "");
};
func.GetGuard = function(req){
	
  var sql = "select dbo.SYS_UserInfo.UserID,dbo.SYS_UserInfo.UserName,dbo.SYS_UserInfo.MobilePhone,dbo.SYS_UserInfo.WorkState,dbo.SYS_UserInfo.Gender,dbo.SYS_UserInfo.Position,dbo.SYS_UserInfo.ShortNum,dbo.SYS_OrgUser.OSID,dbo.SYS_Organization.OSName,dbo.SYS_UserInfo.E_ID from dbo.SYS_UserInfo inner join dbo.SYS_OrgUser on dbo.SYS_UserInfo.UserID = dbo.SYS_OrgUser.UserID inner join dbo.SYS_Organization on dbo.SYS_Organization.OSID = dbo.SYS_OrgUser.OSID where dbo.SYS_UserInfo.E_ID = 123";
  var defered = Q.defer();
  QueryData(sql).done(function(data){ 
    defered.resolve(data);
  },function(err){
     defered.reject(err);
  });
    
    return defered.promise;
}

func.GetPrison = function(req){
	
  var sql = "select * from dbo.SYS_PrisonInfo where E_ID = 123";
  var defered = Q.defer();
  QueryData(sql).done(function(data){ 
    defered.resolve(data);
  },function(err){
     defered.reject(err);
  });
    
    return defered.promise;
}
func.VGetPrison = function(req){
	
  var PageCount = Number(req.pagesize);
  var Page = Number(req.pageindex);
  
 var Pagenext = Page*PageCount;

  //var sql = "select * from dbo.SYS_PrisonInfo";
  
 var sql = "SELECT * FROM dbo.SYS_PrisonInfo WHERE UserID in(SELECT top "+PageCount+" UserID FROM (SELECT top "+Pagenext+" UserID FROM dbo.SYS_PrisonInfo ORDER BY UserID DESC)w ORDER BY w.UserID asc)";
 
  var defered = Q.defer();
  QueryData(sql).done(function(data){ 
    defered.resolve(data);
  },function(err){
     defered.reject(err);
  });
    
  return defered.promise;
    	
}
func.getOrgnization = function(req){

  if(Number(req.E_ID)>0)
  {
	  var sql = "select * from dbo.SYS_Organization where E_ID = "+req.E_ID;
  }
  else
  {
	  var sql = "select * from dbo.SYS_Organization";
  }
  var defered = Q.defer();
  QueryData(sql).done(function(data){ 
    defered.resolve(data);
  },function(err){
     defered.reject(err);
  });
    
    return defered.promise;
}
func.getArea = function(req){

  
  var sql = "select * from dbo.GIS_Line where L_LineType >=4";
  
  var defered = Q.defer();
  QueryData(sql).done(function(data){ 
    defered.resolve(data);
  },function(err){
     defered.reject(err);
  });
    
    return defered.promise;
}
func.getEvent = function(req){

  var defered = Q.defer();
  var sql = "select * from SYS_EventHistory";
  
     QueryData(sql).done(function(data){

       var getdata =[];
       var HT = "正常";
       for(var j=0;j<data.length;j++)
       {
         var item = data[j];
         var miaoshu="";
         var truemiao="";
         var date="";
         var time = "";
         if(item.H_OperTime)
         {
          miaoshu = item.H_OperTime.getTime()/1000;
          truemiao = miaoshu-8*3600;
          date = new Date( truemiao * 1000 );//.转换成毫秒
          time = moment(new Date(date)).format('YYYY-MM-DD HH:mm:ss'); 
         }   
        
         data[j].H_OperTime = time;
       }
       defered.resolve(data);
     
       },function(err){
            
        defered.resolve(err);
       })
    
    return defered.promise;
}
func.getAreaManager = function(data){
	
	var sql = "select * from dbo.AreaManager";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
func.getAreaGuard = function(data){
	
	var sql = "select * from dbo.SYS_AreaUserInfo";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}

func.getAreaPrison = function(data){
	
	var sql = "select * from dbo.PrisonAllowArea";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
func.getAreaEquip = function(data){
	
	var sql = "select * from dbo.SYS_AreaEquip";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
func.getAreaRule = function(data){
	
	var sql = "select * from dbo.AreaForbidRule";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
func.getPosition = function(data){
	
	var guardID = data.GuardID;
	var E_ID = data.E_ID;
	var defered = Q.defer();
	var MyMap = new Map();
	var sql = "select * from dbo.SYS_PrisonInfo where E_ID = "+E_ID+" and CHARINDEX('"+guardID+"',SYS_PrisonInfo.ToguardGroup)>0";
	console.log("得到警员管辖的犯人ID:"+sql);
	QueryData(sql).done(function(data){ 
       
	   var adad = [];
	   if(data.length > 0)
	   {
		   for(var i=0;i<data.length;i++)
		   {
			   var itt = data[i];
			   adad.push(itt.UserID);
		   }
		   
		   var getsql = "select * from dbo.GIS_FloorPosition where U_ID in ("+joinsqlin(adad)+") order by H_Time desc";
		   console.log("得到警员管辖的犯人的实时位置:"+getsql);
		   QueryData(getsql).done(function(data){ 
			   
			   var senddata = [];
			   if(data.length>0)
			   {   
		           
				   for(let i=0;i<data.length;i++)
				   {
					   var item = data[i];
					   if(MyMap.get(item.U_ID))
					   {
						   
					   }
					   else
					   {
						 senddata.push(item);  
					   }
					   MyMap.set(item.U_ID,item) 
				   }
			   }
			   defered.resolve(senddata);
		   },function(err){
			 defered.reject(err);
		   });
		   
	   }
	   else
	   {
		   defered.reject(" ");
		   
	   }
	   
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
	
}
func.getWarning = function(data){
	
	var defered = Q.defer();
	//var sql = "select * from dbo.C_AlarmLog where N_Code = 0 and E_ID = 123";
	var sql = "select * from dbo.C_AlarmLog where E_ID = 123";
	QueryData(sql).done(function(data){ 
	           
			   var datalength = data.length;
			   for(var i=0;i<datalength;i++){
				   
				   var dataitemdate = data[i].AlarmTime;
				   
				   var miaoshu = dataitemdate.getTime()/1000;
				   var truemiao = miaoshu-8*3600;
				   var date = new Date( truemiao * 1000 );//.转换成毫秒
				   var timeto = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
				   
				   //data[i].AlarmTime = timeto;
				   data[i].ReportDate = timeto;
				   
			   }
			   defered.resolve(data);
		   },function(err){
			 defered.reject(err);
		   });
		   
	return defered.promise;
}
func.deleteWarning = function(data){
	
	var defered = Q.defer();
	var sql = "update dbo.C_AlarmLog set N_Code = 1,N_message='"+data.Message+"' where ID = "+data.id;
	
	console.log("删除警告语句"+sql);
	QueryData(sql).done(function(data){ 
			   defered.resolve(data);
		   },function(err){
			 defered.reject(err);
		   });
		   
	return defered.promise;
}
func.getTodayWarning = function(){
	
	
	var defered = Q.defer();
    var dt = moment().format("L").split("/")
    var s = dt[2]+"-"+dt[0]+"-"+dt[1];
	var sql = "select * from dbo.C_AlarmLog where ReportDate = '"+s+"'";
	QueryData(sql).done(function(data){ 
	           
			   var datalength = data.length;
			   for(var i=0;i<datalength;i++){
				   
				   var dataitemdate = data[i].AlarmTime;
				   
				   var miaoshu = dataitemdate.getTime()/1000;
				   var truemiao = miaoshu-8*3600;
				   var date = new Date( truemiao * 1000 );//.转换成毫秒
				   var timeto = moment(new Date(date)).format('YYYY/MM/DD HH:mm:ss'); 
				   
				   data[i].AlarmTime = timeto;
				   
			   }
			   defered.resolve(data);
		   },function(err){
			 defered.reject(err);
		   });
		   
	return defered.promise;
	
}
func.getDrecord = function(data){
	
	var defered = Q.defer();
	
	var sql = "select * from dbo.DCallNumber where E_ID = "+data.E_ID;
	QueryData(sql).done(function(data){ 
			   defered.resolve(data);
		   },function(err){
			 defered.reject(err);
		   });
		   
	return defered.promise;
	
	
}
func.getGuardRFID = function(data){
	
	var sql = "select RFID from dbo.UserInfoRFID where UserID ="+data.UserID;
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
func.saveGuardRFID = function(data){
	
	var sql = "if exists(select * from dbo.UserInfoRFID where UserID="+data.UserID+") update dbo.UserInfoRFID set RFID='"+data.RFID+"' where UserID = "+data.UserID+" else insert into dbo.UserInfoRFID(UserID,RFID,UserName)values("+data.UserID+",'"+data.RFID+"','"+data.UserName+"')";
	var defered = Q.defer();
    QueryData(sql).done(function(data){ 
       defered.resolve(data);
     },function(err){
     defered.reject(err);
     });
    return defered.promise;
}
function QueryData(sql){

  var defered = Q.defer();
  var connect = new Connection(sqlconfig);
  myconnect.querydata(sql,connect,function(err,data){
    
    if(err){

     console.log(err);
     defered.reject(err);

    }
    else
    {
     
     defered.resolve(data);
     
    }
  });
 return defered.promise;
}
function joinsqlin(data)
{
  
    var userg = data;
    var sql ="";
    var str ="";
    var foreignsql ="";
    if(userg.length > 0)
    {
      if(userg.length == 1)
      {
       str = "'"+userg[0]+"'";
      }
      else
      {
        for(var i = 0;i<userg.length;i++)
        {
           if(userg[i])
           {
            if(i == userg.length-1)
            {
              str = str +"'"+userg[i]+"'";
            }
            else
            {
              str = str +"'"+userg[i]+"',";
            }
           }

        }
      }
    }
 return  str;
}
function Map() {
    /** 存放键的数组(遍历用到) */
    this.keys = new Array();
    this.size = 0;
    /** 存放数据 */
    this.data = new Object();

    this.refresh = function () {
        this.size = this.keys.length;
    }
    this.clearstate = function(){

     for (var i = 0; i < this.keys.length; i++) {
           var k = this.keys[i];
           this.data[k].Changflag = 0;
           console.log("RFID:"+k);
        }
        this.refresh();
    }
    /**
     * 放入一个键值对
     * @param {String} key
     * @param {Object} value
     */
    this.set = function(key, value) {
        if(this.data[key] == undefined){
            this.keys.push(key);
        }
        this.data[key] = value;
        this.refresh();
    };
    this.clear = function () {
        this.keys = new Array();
        this.size = 0;
        this.data = new Object();
    }

    /**
     * 获取某键对应的值
     * @param {String} key
     * @return {Object} value
     */
    this.get = function(key) {
        return this.data[key];
    };

    /**
     * 删除一个键值对
     * @param {String} key
     */
    this.delete = function(key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (key == this.keys[i])
                this.keys.splice(i, 1);
        }
        this.data[key] = undefined;
        this.refresh();
    };
    this.has = function (key) {
        for (var i = 0; i < this.keys.length; i++) {
            if (key == this.keys[i]){
                return true;
            }
        }
        return false;
    }
    /**
     * 遍历Map,执行处理函数
     *
     * @param {Function} 回调函数 function(key,value,index){..}
     */
    this.forEach = function(fn){
        if(typeof fn != 'function'){
            return;
        }
        var len = this.keys.length;
        for(var i=0;i<len;i++){
            var k = this.keys[i];
            fn(this.data[k],k,this.data[k]);
        }
    };

    /**
     * 获取键值数组(类似Java的entrySet())
     * @return 键值对象{key,value}的数组
     */
    this.entrys = function() {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            
            var key = this.keys[i];
            var value =  this.data[key];
            entrys[i] = {
                key:key, //this.keys[i],
                value:value //this.data[i]
            };

        
        }


        return entrys;
    };

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function() {
        return this.keys.length == 0;
    };
    /**
     * 重写toString
     */
    this.toString = function(){
        var s = "{";
        for(var i=0;i<this.keys.length;i++,s+=','){
            var k = this.keys[i];
            s += k+"="+this.data[k];
        }
        s+="}";
        return s;
    };
    
}
func.querysql = QueryData;
module.exports = func;