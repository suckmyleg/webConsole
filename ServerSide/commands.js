exports.setup = function(trigger, db){
	trigger.add("allowed", function(data){
		return trigger.run((data.q.query.command==null
			||data.q.query.command=="")?"nocommand":"command", data);
	});

	trigger.add("command", function(data) {
		data.command = {
			executed:false
		}
		return data;
	});

	trigger.add("nocommand", function(data){
		data.return.output = "No command";
		data.return.code = "01";
		return data;
	});

	trigger.add("command", function(data){
		if(!data.command.executed){
			data.return.output = "Uknown command: "+data.q.query.command;
			data.return.code = "200";
		}
		return data;
	});
};