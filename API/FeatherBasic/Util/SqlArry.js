let SQLArryFormat = function(arr){
	
	let phonestring = "";
	let i;
	for(i=0;i<arr.length-1;i++){
		
		phonestring = phonestring+"'"+arr[i]+"',";
		
	}
	phonestring = phonestring+"'"+arr[i]+"'";
	
	return phonestring;
}
module.exports = SQLArryFormat;