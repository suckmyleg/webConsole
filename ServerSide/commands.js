exports.setup = function(trigger, db){
	trigger.add("allowed", function(data){
		return trigger.run((data.q.query.command==null
			||data.q.query.command=="")?"nocommand":"runcommand", data);
	});

	trigger.add("runcommand", function(data) {
		data.command = {
			executed:false
		}
		trigger.run("command_"+data.q.query.command, data);
		return data;
	});

	trigger.add("nocommand", function(data){
		data.return.output = "No command";
		data.return.code = "01";
		return data;
	});

	trigger.add("runcommand", function(data){
		if(!data.command.executed){
			data.return.output = "Uknown command: "+data.q.query.command;
			data.return.code = "200";
		}
		return data;
	});
};