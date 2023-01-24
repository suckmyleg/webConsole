const fs = require('fs');

exports.setup = function(trigger, db){

	var dataHold = {};

	function read(file){
		var triggerData = {"fileName":file, "fileData":null, "error":null};
		triggerData = trigger.run("readFileBefore", triggerData);
		try{
			triggerData.fileData = fs.readFileSync('./DB/'+file,'utf-8');
		}catch(error){
			triggerData.error = error;
			triggerData = trigger.run("readFileError", triggerData);
		}
		triggerData = trigger.run("readFileAfter", triggerData);
		return triggerData.fileData;
	}

	function write(file, data){
		var triggerData = {"fileName":file, "fileData":null, "error":null};
		trigger.run("writeFileBefore", triggerData);
		try{
			fs.writeFileSync('./DB/'+file, data);
		}catch(e){
			triggerData.error = e;
			triggerData = trigger.run("writeFileError", triggerData);
		}
		triggerData = trigger.run("writeFileAfter", triggerData);
	}

	function readHold(file, force=false){
		if(dataHold[file] == null || force){
			var data = read(file);
			dataHold[file] = data;
		}else{
			var data = dataHold[file];
		}
		return data;
	}

	function writeHold(file, data){
		write(file, data);
		dataHold[file] = data;
	}

	function writeLine(file, data){
		write(file, read(file)+"\n"+data);
	}

	trigger.add("readFileError", function(data) {
		console.log("Error reading file");
		write(data.fileName, "");
		data.fileData = "";
		return data;
	});

	exports.read = read;
	exports.write = write;
	exports.writeLine = writeLine;
	exports.db = {
		"write":write, "read":read, "writeLine":writeLine,
		"writeHold":writeHold, "readHold":readHold};
};