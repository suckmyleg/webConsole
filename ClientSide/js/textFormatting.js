var whitecharachtersSpace = 1;
var tabWhiteSpaces = 3;
var hideNumbers = true;

let formats = {
	"$blue$":"<a style='background-color:blue;'>$tab$</a>",
	"$tab$":"&nbsp;".repeat(tabWhiteSpaces),
	"$menu$":function(){return MENU;},
	"$time$":function(){return Date.now();},
	"$version$":function(){return VERSION;},
	" ":"&nbsp;".repeat(whitecharachtersSpace)
};

var operationsResults = {};

function prepareCommandLinecontentDisplay(data){
	var end = "";

	var length = data.contentDisplay.length;

	//NUMBER OF $CHAR$
	var i = (data.contentDisplay.split('$char$').length-1);

	var number = ((length-(6*i)-1));

	number += ((i-1)*`${number+i+1}`.length);

	while(data.contentDisplay.includes("$char$")) {
		data.contentDisplay = data.contentDisplay.replace("$char$", number);
	}
	
	for(var toRemove of Object.keys(formats))
	{
		while(data.contentDisplay.includes(toRemove)) data.contentDisplay = data.contentDisplay.replace(toRemove, formats[toRemove])
	}

	if(data.contentDisplay.includes("$hide$")){
		data.contentDisplay = "";
	}

	if(hideNumbers) data.indexTxt = "";

	data.contentDisplay += end;

	return data;
}

function prepareUserInput(data){
	//data.precontentDisplay = ">";
	data.contentDisplayDisplay = " ";
	data.display = "blackWhite";
	return data;
}

function afterInputEffect(data){
	reLog(data.contentDisplay, false, "whiteBlack", false);
}

function operations(data){
	for(var variableName of Object.keys(operationsResults))
	{
		while(data.contentDisplay.includes("@"+variableName+"@")) data.contentDisplay = data.contentDisplay.replace("@"+variableName+"@", operationsResults[variableName]);
	}

	for(var variableName of Object.keys(operationsResults))
	{
		if(data.contentDisplay.includes(variableName+"&nbsp;es")) data.contentDisplay = data.contentDisplay.replace(variableName+"&nbsp;es&nbsp;", variableName+"&nbsp;es&nbsp;" +operationsResults[variableName]);
		if(data.contentDisplay.includes(variableName+"?")) data.contentDisplay = data.contentDisplay.replace(variableName+"?", variableName+"&nbsp;es&nbsp;" +operationsResults[variableName]);
	}


	var datas = data.contentDisplay.split("=");

	var operation = datas.pop();

	var result = operation;

	for(var variableName of datas){
		operationsResults[variableName] = result;
	}

	return data;
}

function operationsBe(data){
	//console.log("\n\n", data);
	var datas = data.contentDisplay.split("&nbsp;es&nbsp;");

	//console.log(datas);

	var operation = datas.pop();

	var result = operation;

	for(var variableName of datas){
		operationsResults[variableName] = result;
	}
}

addTrigger("userInputConsole", prepareCommandLinecontentDisplay);
addTrigger("userInputConsole", afterInputEffect);
addTrigger("userInputConsole", operationsBe);
addTrigger("preUserInput", prepareUserInput);
addTrigger("commandLineSetup", prepareCommandLinecontentDisplay);
addTrigger("commandLineSetup", operations);