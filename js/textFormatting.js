var whitecharachtersSpace = 1;
var tabWhiteSpaces = 5;

let formats = {
	"$tab$":"&nbsp;".repeat(tabWhiteSpaces),
	" ":"&nbsp;".repeat(whitecharachtersSpace)
};

function prepareCommandLineContent(data){
	var end = "";

	data.content = data.content.replace("$tab$", "&nbsp;".repeat(tabWhiteSpaces));
	data.content = data.content.replace("$tab$", "&nbsp;".repeat(tabWhiteSpaces));
	data.content = data.content.replace("$tab$", "&nbsp;".repeat(tabWhiteSpaces));
	data.content = data.content.replace(" ", "&nbsp;".repeat(whitecharachtersSpace));
	
	if(data.content.includes("$hide$")){
		data.content = "";
	}
	if(data.content == "") data.indexTxt = "&nbsp;&nbsp;";

	data.content += end;

	return data;
}

function prepareUserInput(data){
	data.preContent = "Juan>";
	data.content = "...";
	return data;
}

addTrigger("preUserInput", prepareUserInput);
addTrigger("commandLineSetup", prepareCommandLineContent);