var COMMANDS = {
	"execute":executeCommandLine,
	"help":help,
	"time":time,
	"web": displayWeb,
	"reset":reset,
	"info":info,
	"play":play
}

function displayWeb(href){
	if(href != "")
	{
		addLine("<iframe style='background-color:white;' height='800' width='100%' src='"+href+"'></iframe>");
	}else{
		log("Incorrect url");
	}
}

function play(href){
	if(href.includes("mp3")){
		playMusic(href);
	}else{
		playVideo(href);
	}
}

function playVideo(href){
	if(href != "")
	{
		addLine("<video controls src='"+href+"'>");
	}else{
		log("Incorrect url");
	}

}

function playMusic(href){
	if(href != "")
	{
		addLine("<audio controls><source src='"+href+"' type='audio/mpeg'></audio>");
	}else{
		log("Incorrect url");
	}
}

function time(){
	log(Date.now());
}

function help(){
	log("Commands:")
	for(var command of Object.keys(COMMANDS)){
		log("$tab$"+command);
	}
	log("");
}

function version(){
	log("Version: "+VERSION); 
}

function showTriggers(){
	log("Triggers:")
	for(var triggerName of Object.keys(TRIGGERS)){
		log("$tab$+"+triggerName + ": ");
		log("$tab$$tab$-NFuns: "+TRIGGERS[triggerName].length+"\n");
	}
}

function info(){
	version();
	showTriggers();
}

function executeCommandLine(content){
	var datas = content.split(" ");

	var command = datas[0];

	var content = content.replace(command+" ", "");

	content = content == command?"":content;

	var fun = COMMANDS[command];

	if(fun != null)
	{
		//log("["+command+"] "+content)
		fun(content)
	}
	else{
		log("Uknown command")
	}
}

function executeCommandLineFromConsole(data){
	reLog(data.content, false, "whiteBlack", false);
	executeCommandLine(data.content);
	return data;
}

addTrigger("userInputConsole", executeCommandLineFromConsole);