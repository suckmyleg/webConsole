let VERSION = "0.0.2";
var INDEX = 0;
var WAITTINGINPUT = [];
var TRIGGERS = {};
var INPUTINDEXMESSAGE = 0;
var LASTLOGDATA = {};
var MESSAGEANIMATIONDELAY = 5;

var MENU = "";
var MENUS = {}

function trigger(name, args={}){
	console.log("Start", name, args);

	var funs = TRIGGERS[name];

	if(funs != null)
	{
		var newArgs = null;
		for(var funInfo of funs){
			if(funInfo[1].length == 0 || funInfo[1].includes(MENU)){
				newArgs = funInfo[0](args);
			}
		}
		if(newArgs != null) args = newArgs;
	}
	console.log("End", name, args);
	return args;
}

function addTrigger(name, fun, menus=[]){
	try{
		TRIGGERS[name].push([fun, menus]);
	}catch{
		TRIGGERS[name] = [[fun, menus]];
	}
}

function addMenu(name, inputFun, inputText, commands={}, before="MAIN"){
	commands["return"] = exitMenu;
	MENUS[name] = {
		"input":inputFun,
		"inputText":inputText,
		"before":before,
		"commands":commands
	}
}

function exitMenu(){
	setMenu(MENUS[MENU].before);
}

function continueMenu(){
	var menuData = MENUS[MENU];
	COMMANDS = menuData.commands;
	input(menuData.input, menuData.inputText);
}

function setMenu(menuName){
	if (MENUS[menuName] != null) MENU = menuName;
}

function changeMenu(menuName){
	var menuData = MENUS[menuName];
	WAITTINGINPUT = [menuData.input];
	MENU = menuName;
	COMMANDS = menuData.commands;
}

function goMenu(menuName){
	var menuData = MENUS[menuName];
	WAITTINGINPUT = [];
	input(menuData.input, menuData.inputText);
	MENU = menuName;
	COMMANDS = menuData.commands;
}



function reset(){
	INDEX = 0;
	WAITTINGINPUT = [];
	INPUTINDEXMESSAGE = 0;
	LASTLOGDATA = {};

	setup();
}

function scrollBottom(){
	console.log("Scrolling to bottom");

	$("#output").animate({
	scrollTop: $(
	'#output').get(0).scrollHeight
	}, 1);
}

function focusInput(){
	$("input:text:visible:first").focus();
}

function focus(){
	focusInput();
	scrollBottom();
}

function sendInput(text){
	var fun = WAITTINGINPUT.shift()
	
	if(fun != null)
	{
		trigger("userInputConsole", {"content":text, "contentDisplay":text});
		fun(text);
	}

	continueMenu();
}

function setup(){
	$("#console").html("<div id='output'></div><div id='input'></div>");
	$("#output").html("<ul id='outputList'></ul>");
	$("#input").html("<input title='input' length='50' type='text' id='inputInput' class='inputHidden'>");

	$("#inputInput").on("input", function(e) {
		var self = this;

		setTimeout(function(){
			reLog($(self).val()+" ", INPUTINDEXMESSAGE, "blackWhite", false);
		}, 1);
	});

	$("#inputInput").keypress(function(e) {
		var keycode = (e.keyCode?e.keyCode:e.which);
		if(keycode  == 13)
		{
			sendInput($(this).val());
			$(this).val("");
			focus();
		}
	});

	focus();

	$(document).on("click", function(){
		$("input:text:visible:first").focus();
	});

	log("Juan Console [Version "+VERSION+"]\nAll rights reserved.\n ");
}









function execute(text){}










function input(fun, text=false){
	if(text !== false) {
		var data = trigger("preUserInput", {"content":"", "contentDisplay":"", "display":"whiteBlack", "preContent":text})
		INPUTINDEXMESSAGE = log(data.contentDisplay, data.display, data.preContent);
	}
	WAITTINGINPUT.push(fun);
}


function reLog(text="", index="", display="whiteBlack", preContent=""){
	text = text===false?LASTLOGDATA.text:text;
	display = display===false?LASTLOGDATA.display:display;
	preContent = preContent===false?LASTLOGDATA.preContent:preContent;

	if(index === false) index = INDEX-1;
	setLineMessage(text, index, display, preContent);
}

function log(text, display="whiteBlack", preContent=""){
	text = ""+text;

	for(var message of text.split("\n"))
	{
		addLineMessage(message, INDEX, display, preContent);
	}
	return INDEX-1;
}


function setupCommandLineHtml(index, indexTxt, preContent, content, classes){
	return "<label class='index'>"+indexTxt+"</label><div class='contentContainer "+classes+"'><label class='preContent'>"+preContent+"</label><LIT class='content multiline'>"+content+"</LIT></div>";
}

function setupLineMessage(index, content, display, preContent){
	var data = trigger("commandLineSetup", {"preContent":preContent, "content":content, "contentDisplay":content, "index":index, "indexTxt":""+index, "display":display});
	LASTLOGDATA = data;
	return setupCommandLineHtml(data.index, data.indexTxt, data.preContent, data.contentDisplay, data.display);
}










function setLineMessage(content="", index=INDEX, display="whiteBlack", preContent=""){
	setLine(setupLineMessage(index, content, display, preContent), index);
}

function addLineMessage(content="", index=INDEX, display="whiteBlack", preContent=""){
	return addLine(setupLineMessage(index, content, display, preContent), index);
}

function addLineMessageAnimated(content="", index=INDEX, display="whiteBlack", preContent=""){
	var temporalContent = "";
	var index = addLine(setupLineMessage(index, temporalContent, display, preContent), index);
	var i = 0;
	addLineMessageAnimatedFor(content, index, display, preContent, 0);
}

function addLineMessageAnimatedFor(content, index, display, preContent, i){
	var c = content.substring(0, i);
	if(i <= content.length)
	{
		setLineMessage(c, index, display, preContent);
		setTimeout(function(){
			addLineMessageAnimatedFor(content, index, display, preContent, i+1);
		}, MESSAGEANIMATIONDELAY);
	}
}





function setLine(content="", index=INDEX){
	$("#commandLine"+index).html(content);
}

function addLine(content="", index=INDEX){
	$("#outputList").append("<li id='commandLine"+index+"'>" + content + "</li>");
	INDEX += 1;
	return INDEX-1;
}






function getUrlsData(){
	var variables = {};

	for (var variable of window.location.href.split("?")[1].split("&")){
		variable = variable.split("=");
		variables[variable[0]] = variable[1].replace("%20", " ");
	}
	return variables;
}


function reactMessagesUrl(){
	try{
		for(var message of getUrlsData()["toSend"].split(";")){
			if(message !== ""){
				sendInput(message);
			}
		}
	}catch{}
}




$(document).ready(function(){
	setup();
	goMenu("MAIN");
	reactMessagesUrl();
	$(document).ready();
	onload = function(){}
});
