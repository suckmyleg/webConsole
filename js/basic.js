var COMMANDS = {}

function cls(){
	INDEX = 0;
	$("#output").html("<ul id='outputList'></ul>");
}

function menu(name){
	try{
		setMenu(name);
	}catch{
		log("Menu "+name+" doesnt exists");
	}
}

function displayConsole(command=""){
	displayWeb("index.html?toSend="+command);
}

function displayWeb(href){
	if(href != "")
	{
		//addLine("<iframe style='background-color:white;' height='800' width='100%' src='"+href+"'></iframe>");
		addLine("<iframe style='background-color:white;' height='auto' width='100%' src='"+href+"' frameBorder='0'></iframe>");
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
	if(href.includes(".mp4"))
	{
		addLine("<video controls src='"+href+"'>");
	}else{
		log("Incorrect url");
	}
}

function playMusic(href){
	if(href.includes(".mp3"))
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

function showActualMenu(){
	log("Menu: "+MENU);
}

function showActualMenuCommands(){
	log("Commands: "+Object.keys(COMMANDS));
}

function showMenus(){
	log("MENUS:")
	for(var menuName of Object.keys(MENUS)){
		log("$tab$+"+menuName + ": ");
		log("$tab$$tab$-Commands: "+Object.keys(MENUS[menuName].commands)+"\n");
	}
}

function info(){
	version();
	log("Time: $time$");
	showActualMenu();
	showActualMenuCommands();
	showTriggers();
	showMenus();
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
		trigger("inputWrongCommand", {"command":command,"content":content});
		//log("Uknown command")
	}
}

function executeCommandLineFromConsole(data){
	executeCommandLine(data.content);
	return data;
}

addTrigger("userInputConsole", executeCommandLineFromConsole);

addMenu("MAIN", execute,  "JuanConsole/Main>",{
	"execute":executeCommandLine,
	"help":help,
	"time":time,
	"web": displayWeb,
	"reset":reset,
	"info":info,
	"play":play,
	"menu":menu,
	"cls":cls,
	"new":displayConsole,
	"showNumbers":function(data){hideNumbers = false;},
	"hideNumbers":function(data){hideNumbers = true;},
	"changeAnimationDelay":function(data){MESSAGEANIMATIONDELAY = data;},
	"end":function(data){}
});