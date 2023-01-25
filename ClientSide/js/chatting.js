const Http = new XMLHttpRequest();

let chatSelected = "NoChat";

let serverHost = "http://192.168.1.208";
let serverPort = "8080";

let user = "";
let passw = "";

function createUrl(command, data=""){
	console.log(serverHost+":"+serverPort+"?user="+user+"&passw="+passw+"&command="+command+data);
	return serverHost+":"+serverPort+"?user="+user+"&passw="+passw+"&command="+command+data;
}

function sendMessage(message){
	Http.open("GET", createUrl("sendMessage", "&to="+chatSelected+"&message="+message));
	Http.send();
}

function recvMessages(from){
	Http.open("GET", createUrl("recvMessages"));
	Http.send();
	Http.onreadystatechange = function(){
		if(this.readyState==4&&this.status==200)
		{
			let messagesData = JSON.parse(this.responseText);
			for(let message of messagesData.output){
				log(message.message);
			}
		}
	}
}

function preData(){
	return user+"@"+chatSelected+">";
}

function whenMessage(message){}

addMenu("Chat", whenMessage, preData(), {
	"help":help,
	"select":function(chat){chatSelected = chat;changePreInput(preData());},
	"pull":function(){recvMessages(chatSelected);},
	"push":function(message){sendMessage(message);},
	"setUser":function(data){user=data;changePreInput(preData());},
	"setPassw":function(data){passw=data;}
});