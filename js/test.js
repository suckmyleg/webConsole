function whenMessage(message){}

addMenu("Test", whenMessage, "Test>", {
	"help":function(){log("Commands: \n$tab$None xd")},
	"test":function(command){try{log("Running command: "+command);executeCommandLine(command);log("OK");}catch{console.log("FAIL\n"+command);}}
});

addTrigger("inputWrongCommand", function(data){
	for(var fun of Object.keys(COMMANDS)){
		if(fun.toLowerCase() == data.command.toLowerCase()){
			log("Did you meant, '"+fun+"'?");
		}
	}
});