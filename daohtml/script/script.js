/************************************
 *          Initialization          *
 ************************************/

var dougADDR = key.addressOf("fc87f9b92b37b9b6133a22ff3352f72996de77eb");

var dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));

var dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));
var dtt = u256.toValue(dougTEST);
var dat = u256.toValue(u256.fromAddress(dougADDR));

while (dtt != dat){
	dougADDR = u256.toAddress(dougTEST)
	dougTEST = eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("doug",32)));
	dtt = u256.toValue(dougTEST);
	dat = u256.toValue(u256.fromAddress(dougADDR));
};

var dbADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("magdb",32))));
var adminADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("user",32))));
var nickADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("nick",32))));
var pollADDR = u256.toAddress(eth.storageAt(dougADDR, bytes.u256of(bytes.fromString("pollcode",32))));

 
var infohashes = new Array();
var pollAddrs = new Array();
var contractAddrs = new Array();
var currentPollAddress = null;

window.onload = function(){
	
	var myNick = getMyNick();
	
	if(myNick == null || myNick == ""){
			document.getElementById("adminLinkL").innerHTML = "Register";
	}
	prepareDatabasePage();
}

/************************************
 *              Menu                *
 ************************************/

switchPage = function(callerID){

   if(callerID == "0"){
		document.getElementById("containerDatabase").style.display = "block";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
		prepareDatabasePage();
	} else if(callerID == "1"){	
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "block";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "none";
		if(getMyAdminLevel() > 1){
			document.getElementById("pollViewMenu").style.display = "block";
		} else {
			document.getElementById("pollViewMenu").style.display = "none";
		}
	} else if(callerID == "2"){
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "block";
		document.getElementById("containerAdmin").style.display = "none";
	} else if(callerID == "3"){
		document.getElementById("containerDatabase").style.display = "none";
		document.getElementById("containerConsensus").style.display = "none";
		document.getElementById("containerAbout").style.display = "none";
		document.getElementById("containerAdmin").style.display = "block";
			
		if(getMyNick() == ""){
			document.getElementById("registerSection").style.display = "block";
			document.getElementById("adminEditSection").style.display = "none";
			document.getElementById("userTableSection").style.display = "none";
		} else {
			document.getElementById("registerSection").style.display = "none";
			document.getElementById("adminEditSection").style.display = "block";
			document.getElementById("userTableSection").style.display = "block";
			// If I'm an admin.			
			if (getMyUserLevel() > 1) {
				document.getElementById("adminButtons").style.display = "block";
			} else {
				document.getElementById("adminButtons").style.display = "none";			
			}
		}
		
	}

}

/************************************
 *         Database stuff           *
 ************************************/

prepareDatabasePage = function(){
	var myNick = getMyNick();
	if(myNick == ""){
		// Fix the input fields.
		document.getElementById('infohashInputField').disabled = true;
		document.getElementById('uploaderInputField').disabled = true;
		document.getElementById('filetypeInputField').disabled = true;
		document.getElementById('filequalityInputField').disabled = true;
		document.getElementById('titleInputField').disabled = true;
		document.getElementById('descriptionTextArea').disabled = true;
		document.getElementById('createDocumentButton').style.display = "none";
		document.getElementById('updateDocumentButton').style.display = "none";
		
	} else {
		document.getElementById('infohashInputField').disabled = false;
		document.getElementById('uploaderInputField').disabled = false;
		document.getElementById('filetypeInputField').disabled = false;
		document.getElementById('filequalityInputField').disabled = false;
		document.getElementById('titleInputField').disabled = false;
		document.getElementById('descriptionTextArea').disabled = false;
		document.getElementById('createDocumentButton').style.display = "block";
		document.getElementById('updateDocumentButton').style.display = "none";
	}
	document.getElementById('deleteDocumentButton').style.display = "none";
	
	document.getElementById('infohashInputField').value = "";
	document.getElementById('uploaderInputField').value = myNick;
	document.getElementById('filetypeInputField').value = "";
	document.getElementById('filequalityInputField').value = "";
	document.getElementById('titleInputField').value = "";
	document.getElementById('descriptionTextArea').value = "";
	
}

generateTable = function(){
	//hi
	var pointer1 = u256.value(32);
	var pointer2 = u256.value(37);
	var pointer3 = u256.value(38);
	
	var limit = u256.toValue(eth.storageAt(dbADDR, u256.value(21)));
	var titles = new Array();
	infohashes = new Array();
	
	for (var i = 0; i < limit; i++) {
		
		var tstr = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer2)));
		tstr = tstr + bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer3)));
		titles[i] = tstr;
		infohashes[i] = eth.storageAt(dbADDR, pointer1);
		
		pointer1 = u256.add(pointer1, u256.value(32));
		pointer2 = u256.add(pointer2, u256.value(32));
		pointer3 = u256.add(pointer3, u256.value(32)); 
		
	};
	
	var table= "<table>";
	
	for (var j = 0; j < titles.length; j++) {
			table+='<tr><td><a href="javascript:void(0)" onclick="resolveMagnetLink(' + '&quot;' + j + '&quot;' + ');">' + 
			(j+1) + ':  ' + titles[j] + '</a></td></tr>';
	}
	
	table+="</table>";
	document.getElementById('datatable').innerHTML = table;

}

resolveMagnetLink = function(hashIndex)
{
	var index = parseInt(hashIndex);
	var infohs = infohashes[index];
	
	var pointer = u256.add(infohs, eth.storageAt(dbADDR, u256.value(20)));
	pointer = eth.storageAt(dbADDR, pointer);
	
	pointer = u256.add(pointer, u256.value(2));
	
	var uploader = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var filetype = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var filequality = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	
	var title1 = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	pointer = u256.add(pointer, u256.value(1));
	var title2 = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
	var title = title1 + title2;
	
	var desc = "";
	for (var i = 0; i < 25; i++) {
		pointer = u256.add(pointer, u256.value(1));
		var temp = bytes.toString(u256.bytesOf(eth.storageAt(dbADDR, pointer)));
		desc = desc + temp;
	}
	
	document.getElementById('infohashInputField').value = (u256.toValue(infohs)).toString(16);
	document.getElementById('uploaderInputField').value = uploader;
	document.getElementById('filetypeInputField').value = filetype;
	document.getElementById('filequalityInputField').value = filequality;
	document.getElementById('titleInputField').value = title;
	document.getElementById('descriptionTextArea').value = desc;
	
	var myNick = getMyNick();
	if(myNick != ""){
		if(myNick == uploader){
			// Fix the input fields.
			document.getElementById('infohashInputField').disabled = true;
			document.getElementById('uploaderInputField').disabled = true;
			document.getElementById('filetypeInputField').disabled = false;
			document.getElementById('filequalityInputField').disabled = false;
			document.getElementById('titleInputField').disabled = false;
			document.getElementById('descriptionTextArea').disabled = false;
			// Fix the buttons.		
			document.getElementById('updateDocumentButton').style.display = "block";
			document.getElementById('deleteDocumentButton').style.display = "block";
		} else {
			// Fix the input fields.
			document.getElementById('infohashInputField').disabled = true;
			document.getElementById('uploaderInputField').disabled = true;
			document.getElementById('filetypeInputField').disabled = true;
			document.getElementById('filequalityInputField').disabled = true;
			document.getElementById('titleInputField').disabled = true;
			document.getElementById('descriptionTextArea').disabled = true;
			
			document.getElementById('updateDocumentButton').style.display = "none";
			var myLevel = getMyUserLevel();
			if(myLevel > 1){				
				document.getElementById('deleteDocumentButton').style.display = "block";			
			} else {
				document.getElementById('deleteDocumentButton').style.display = "block";			
			}
		}
		document.getElementById('createDocumentButton').style.display = "none";
		
	}
	
}

updateDocument = function()
{
	var ulString = document.getElementById("uploaderInputField").value;
	var myNick = getMyNick();
	if(ulString != myNick){
		window.alert("The uploader name must match your nickname (" + myNick + ").");
		return;
	}
	
	var infohash = u256.bytesOf(u256.value(parseInt(document.getElementById("infohashInputField").value, 16)));
	var title = bytes.fromString(document.getElementById("titleInputField").value, 64);
	var uploader = bytes.fromString(ulString, 32);
	var filetype = bytes.fromString(document.getElementById("filetypeInputField").value, 32);
	var filequality = bytes.fromString(document.getElementById("filequalityInputField").value, 32);
	var descript = bytes.fromString(document.getElementById("descriptionTextArea").value, 800);
	
	var indicator = u256.bytesOf(u256.value(parseInt("111111", 16)));
	var command = bytes.fromString("moddbe",32);
	
	var payload = command;
	payload = bytes.concat(payload, infohash);
	payload = bytes.concat(payload, indicator);
	payload = bytes.concat(payload, uploader);
	payload = bytes.concat(payload, filetype);
	payload = bytes.concat(payload, filequality);
	payload = bytes.concat(payload, title);
	payload = bytes.concat(payload, descript);
	
	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), dbADDR, payload, u256.value(100000), eth.gasPrice());

};

deleteDocument = function()
{
	var infohash = u256.bytesOf(u256.value(parseInt(document.getElementById("infohashInputField").value, 16)));
	var command = bytes.fromString("deldbe",32);

	var payload = bytes.concat(command,infohash);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), dbADDR, payload, u256.value(100000), eth.gasPrice());	
	clearDocument();
};

clearDocument = function()
{
	prepareDatabasePage();
};

/************************************
 *         Consensus stuff          *
 ************************************/

readContractMeta = function(contractDataSlot)
{
	var index = parseInt(contractDataSlot);
	

	var ADDR = key.addressOf(contractAddrs[index]);
	currentPollAddress = pollAddrs[index];

	var metaident = u256.toValue(eth.storageAt(ADDR, u256.value(0)));

	if (metaident == 585546221227) {
		var creat = u256.toValue(eth.storageAt(ADDR, u256.value(1)));

		var auth = bytes.toString(u256.bytesOf(eth.storageAt(ADDR, u256.value(2))));

		var da = u256.toValue(eth.storageAt(ADDR, u256.value(3)));
		var d1 = da%65536;
		var d2 = (Math.floor(da/65536))%256;
		var d3 = (Math.floor(da/16777216))%256;
		var date = d3.toString(16)+"/"+d2.toString(16)+"/"+d1.toString(16);

		var ve = u256.toValue(eth.storageAt(ADDR, u256.value(4)));
		var v1 = ve%65536;
		var v2 = (Math.floor(ve/65536))%256;
		var v3 = (Math.floor(ve/16777216))%256;
		var vers = v3.toString(16)+"."+v2.toString(16)+"."+v1.toString(16);

		var name = bytes.toString(u256.bytesOf(eth.storageAt(ADDR, u256.value(5))));;

		var desc = "";
		for (var i = 6; i <= 15; i++) {
			var temp = bytes.toString(u256.bytesOf(eth.storageAt(ADDR, u256.value(i))));
			desc = desc + temp;
		}

		document.getElementById('contractCreator').value = creat;
		document.getElementById('contractAuthor').value = auth;
		document.getElementById('contractDate').value = date;
		document.getElementById('contractVersion').value = vers;
		document.getElementById('contractName').value = name;
		document.getElementById('contractDescriptionTextArea').value = desc;
	};
}
	
generatePollTable = function(){

	// Get tail at 0x18
	var pointer = eth.storageAt(dougADDR,u256.value(24));

	
	if(u256.isNull(pointer)){
		document.getElementById('contractCreator').value = "null";		
	}

	pollAddrs = new Array();
	contractAddrs = new Array();

	var contractNames = new Array();
	
	var table= "<table><tr><td>Poll</td></tr>";
	
	var counter = 0;
	
	while(!u256.isNull(pointer)){
		var next = u256.add(pointer,u256.value(1));
		
		
		pollAddrs[counter] = pointer;
		pointer = eth.storageAt(dougADDR,pointer);
		
		contractAddrs[counter] = pointer;
		pointer = eth.storageAt(dougADDR,pointer);
		contractNames[counter] = bytes.toString(u256.bytesOf(pointer));
		
		
		table+='<tr><td><a href="javascript:void(0)" onclick="readContractMeta(' + '&quot;' + 
		counter + '&quot;' + ');">' + contractNames[counter] + '</a></td></tr>';		
		
		pointer = eth.storageAt(dougADDR,next);
		counter++;
	}
	
	table+="</table>";
	document.getElementById('pollTable').innerHTML = table;
	
}


/*
vote = function(yesno){
	var ADDR = key.addressOf(currentPollAddress);
	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), ADDR, payload, u256.value(100000), eth.gasPrice());	
}
*/

/************************************
 *       User related stuff         *
 ************************************/

removeUser = function(){
	var userName = document.getElementById("userNicknameInputField").value;

	if(userName == null || userName == ""){
		window.alert("No user name has been specified.");
		return;
	}
	
	if(userName == getMyNick()){
			window.alert("If you want to remove yourself, use the 'Delete Me' command.");
			return;
	}
	
	var sure = confirm("Are you sure you want to delete member: " + userName + "?");	
	if(!sure){
		window.alert("User was not removed.");
		return;
	}
	
	var command = bytes.fromString("dereg",32);	
	var nameBytes = bytes.fromString(userName,32);
	

	var payload = bytes.concat(command,nameBytes);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), nickADDR, payload, u256.value(100000), eth.gasPrice());
	
}

promoteUser = function(){
	
	var userName = document.getElementById("userNicknameInputField").value;

	if(userName == null || userName == ""){
		window.alert("No username has been specified.");
		return;
	}
	
	var sure = confirm("Are you sure you want to promote user: " + userName + "?\n\nThey will be given administrator privileges.");
	
	if(!sure){
		window.alert("User was not promoted.");
		return;	
	}
	
	var command = bytes.fromString("regadm",32);
	
	var addrBytes = u256.bytesOf(getAddress256FromNick(userName));
	
	var payload = bytes.concat(command,addrBytes);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), adminADDR, payload, u256.value(100000), eth.gasPrice());
	
}

deleteMe = function(){
	var sure = confirm("Are you sure you want to delete your own account?");	
	if(!sure){
		window.alert("Account not deleted.");
		return;	
	}
	if(getMyUserLevel() > 1){
		var superSure = confirm("Are you sure? You will loose your admin privileges.");	
		if(!superSure){
			window.alert("Account not deleted.");
			return;
		}
	}
	
	var payload = bytes.fromString("dereg",32);
	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), nickADDR, payload, u256.value(100000), eth.gasPrice());
	window.alert("Your account will be removed shortly.");
}

generateUserTable = function(){
	
	var pointer = u256.value(18); // Tail
	// Size of the linked list.
	var size = u256.toValue(eth.storageAt(nickADDR, u256.value(17)));
	var nicks = new Array();
	var addrii = new Array(); // Deal with it
	var userPrivs = new Array();
	
	
	// We need to jump past the tail, as it is only the contract nick.	
	// pointer = eth.storageAt(nickADDR, pointer);
	// pointer = u256.add(pointer, u256.value(2));
	
	for (var i = 0; i < size; i++) {
		pointer = eth.storageAt(nickADDR, pointer);
		var nick = bytes.toString(u256.bytesOf(pointer));
		nicks[i] = nick;
		addrii[i] = eth.storageAt(nickADDR,pointer);
		// Get the address of the user.
		var priv = eth.storageAt(adminADDR, addrii[i]);
		
		userPrivs[i] = u256.toValue(priv);
		pointer = u256.add(pointer, u256.value(2));
	};
	
	var table= "<table><tr><td>Nickname</td><td>Type</td></tr>";
	
	for (var j = 0; j < nicks.length; j++) {
		var userTypeStr = null;
		switch(userPrivs[j])
		{
			case 0:
		  		userTypeStr = "Squatter";
		  		break;
			case 1:
		  		userTypeStr = "Member";
				break;
			default:
			  userTypeStr = "Admin";
		}
		var addressString = key.stringOf(u256.toAddress(addrii[j]));
		table+='<tr><td><a href="javascript:void(0)" onclick="resolveUserLink(' + '&quot;' + 
		addressString + ':' + userPrivs[j].toString() + ':' + nicks[j] + '&quot;' + ');">' + nicks[j] + 
		'</a></td><td>' + userTypeStr + '</td></tr>';
	}
	
	table+="</table>";
	document.getElementById('userTable').innerHTML = table;
	
}

resolveUserLink = function(userName)
{
	var tokens = userName.split(':');
	document.getElementById('userAddressInputField').value = tokens[0];
	if(tokens[1] == "3"){
		document.getElementById('adminRadio').checked = true;		
	} else {
		document.getElementById('userRadio').checked = true;	
	}
		document.getElementById('userNicknameInputField').value = tokens[2];
}

registerNickname = function(){
	var nameString = document.getElementById("registerNicknameInputField").value;
	if(nameString == null || nameString == ""){
		window.alert("There is no name in the nickname field.");
		return;
	}

	var command = bytes.fromString("reg",32);	
	var nameBytes = bytes.fromString(nameString,32);
	

	var payload = bytes.concat(command,nameBytes);

	eth.transact(key.secret(eth.keys()[0]), u256.ether(0), nickADDR, payload, u256.value(100000), eth.gasPrice());
	
}

/************************************
 *     DOUG utility functions       *
 ************************************/

// Returns nickname as a u256 object.
getMyNick256 = function(){
	var myAddr256 = u256.fromAddress(key.address(eth.key()));
	var myNick256 = eth.storageAt(nickADDR, myAddr256);
	if(u256.isNull(myNick256)) {
		return u256.value(0);
	}
	return myNick256;
}

// Returns nickname as a string.
getMyNick = function(){
	var myNick256 = getMyNick256();
	return bytes.toString(u256.bytesOf(myNick256));
}

// Returns user level as a number.
getMyUserLevel = function(){
	var myAddr256 = u256.fromAddress(key.address(eth.keys()[0]));
	return u256.toValue(eth.storageAt(adminADDR, myAddr256));
}

getAddress256FromNick = function(nickName){
	var nick256 = bytes.u256of(bytes.fromString(nickName,32));
	return eth.storageAt(nickADDR,nick256);
}

