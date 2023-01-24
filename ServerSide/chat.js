exports.setup = function(trigger, db){
	trigger.add("command_sendMessage", function(data) {
		console.log(data.q.query.message);
	});
};