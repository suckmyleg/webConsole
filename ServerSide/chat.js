exports.setup = function(trigger, db){
	let messagesData = {};

	trigger.add("command_sendMessage", function(data) {
		data.q.query.from = data.q.query.user;

		if(data.q.query.message==undefined||data.q.query.message==false) return trigger.run("chatNoMessage", data);
		if(data.q.query.from==undefined||data.q.query.from==false) return trigger.run("chatNoEmiter", data);
		if(data.q.query.to==undefined||data.q.query.to==false) return trigger.run("chatNoReciever", data);
		return trigger.run("chatMessage", data);
	});

	trigger.add("command_recvMessages", function(data) {
		data.command.executed = true;
		try{
			data.return.output = messagesData[data.q.query.user];
		}catch{
			data.return.output = [];
		}
		messagesData[data.q.query.user] = [];

		return data;
	});

	trigger.add("chatNoMessage", function(data) {
		data.command.executed = true;
		data.return.output = "No message";
		data.return.code = "03";
		return data;
	});

	trigger.add("chatMessage", function(data) {
		data.command.executed = true;
		let messageData = {"from":data.q.query.from, "message":data.q.query.message, "date":Date.now()};
		try{
			messagesData[data.q.query.to].push(messageData);
		}catch{
			messagesData[data.q.query.to] = [messageData];
		}
		data.return.code = "200";
		data.return.output = "Message sent";
		return data;
	});

	trigger.add("chatNoEmiter", function(data) {
		data.command.executed = true;
		data.return.output = "No emissor";
		data.return.code = "02";
		return data;
	});

	trigger.add("chatNoReciever", function(data) {
		data.command.executed = true;
		data.return.output = "No reciever";
		data.return.code = "04";
		return data;
	});
};