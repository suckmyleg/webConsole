let VERSION = "0.0.1";
var INDEX = 0;
var WAITTINGINPUT = [];
var TRIGGERS = {};
var INPUTINDEXMESSAGE = 0;
var LASTLOGDATA = {};

function trigger(name, args={}){
	console.log("Start", name, args);

	var funs = TRIGGERS[name];

	if(funs != null)
	{
		var newArgs = null;
		for(var fun of funs){
			newArgs = fun(args);
		}
		if(newArgs != null) args = newArgs;
	}
	console.log("End", name, args);
	return args;
}


function addTrigger(name, fun){
	try{
		TRIGGERS[name].push(fun);
	}catch{
		TRIGGERS[name] = [fun];
	}
}



function reset(){
	INDEX = 0;
	WAITTINGINPUT = [];
	INPUTINDEXMESSAGE = 0;
	LASTLOGDATA = {};

	setup();
}


function setup(){
	$("#console").html("<div id='output'></div><div id='input'></div>");
	$("#output").html("<ul id='outputList'></ul>");
	$("#input").html("<input title='input' length='50' type='text' id='inputInput'>");

	$("#inputInput").on("input", function(e) {

		var self = this;

		setTimeout(function(){
			reLog($(self).val()+"_", INPUTINDEXMESSAGE, "focusedCommandLine", false);
		}, 1);
	});

	$("#inputInput").keypress(function(e) {
		var keycode = (e.keyCode?e.keyCode : e.which);
		if(keycode  == 13)
		{
			var fun = WAITTINGINPUT.shift()
			
			if(fun != null)
			{
				fun($(this).val());
			}

			$(this).val("");

			$("#output").animate({
			scrollTop: $(
			'#output').get(0).scrollHeight
			}, 1);
		}
	});


	$("input:text:visible:first").focus();

	$(document).on("click", function(){
		$("input:text:visible:first").focus();
	});



	input(execute, "> ");

}









function execute(text){
	var data = trigger("userInputConsole", {"content":text});
	input(execute, "> ");
}














function input(fun, text=false){
	if(text) {
		var data = trigger("preUserInput", {"content":"", "display":"whiteBlack", "preContent":text})
		INPUTINDEXMESSAGE = log(data.content, data.display, data.preContent);
	}
	WAITTINGINPUT.push(fun);
}


function reLog(text="", index="", display="whiteBlack", preContent=""){
	text = text===false?LASTLOGDATA.text:text;
	display = display===false?LASTLOGDATA.display:display;
	preContent = preContent===false?LASTLOGDATA.preContent:preContent;

	if(index == false) index = INDEX-1;
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
	return "<label class='index'>"+indexTxt+"</label><div class='contentContainer "+classes+"'><label class='preContent'>"+preContent+"</label><LIT class='content'>"+content+"</LIT></div>";
}

function setupLineMessage(index, content, display, preContent){
	var data = trigger("commandLineSetup", {"preContent":preContent, "content":content, "index":index, "indexTxt":""+index, "display":display});
	LASTLOGDATA = data;
	return setupCommandLineHtml(data.index, data.indexTxt, data.preContent, data.content, data.display);
}






function setLineMessage(content="", index=INDEX, display="whiteBlack", preContent=""){
	setLine(setupLineMessage(index, content, display, preContent), index);
}

function addLineMessage(content="", index=INDEX, display="whiteBlack", preContent=""){
	addLine(setupLineMessage(index, content, display, preContent), index);
}





function setLine(content="", index=INDEX){
	$("#commandLine"+index).html(content);
}

function addLine(content="", index=INDEX){
	$("#outputList").html($("#outputList").html() + "<li id='commandLine"+index+"'>" + content + "</li>");
	INDEX += 1;
}


$(document).ready(function(){
	setup();
});
