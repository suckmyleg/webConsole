exports.setup = function(trigger, db){
	function userFull(user, passw, node){
		return `|${user}@${node}[${passw}]|`;
	}

	var access = function(user, passw, node){	
		console.log("Requesting access "+user+"@"+node);

		//console.log(db.readHold("accessData.txt").replace("\r", "").split("\n"), userFull(user, passw, node));

		if(db.readHold("accessData.txt").includes(userFull(user, passw, node))
			|| db.readHold("accessData.txt").includes(userFull("*", passw, node))
			|| db.readHold("accessData.txt").includes(userFull(user, "*", node))
			|| db.readHold("accessData.txt").includes(userFull(user, passw, "*"))
			|| db.readHold("accessData.txt").includes(userFull("*", passw, "*"))
			|| db.readHold("accessData.txt").includes(userFull("*", "*", node))
			|| db.readHold("accessData.txt").includes(userFull("*", "*", "*"))){

			return true;
		}else{
			return false;
		}
	};

	trigger.add("request", function(data){
		if(data.req.url == "/favicon.ico"){
			data.head.code = 404;
			data.continue = false;
		}else{
			data = trigger.run(access(data.q.query.user, data.q.query.passw, "request")?"allowed":"denied", data);
		}
		return data;
	});

	/*trigger.add("*", function(data){
		if(!["allowed", "denied"].includes(data.triggerData.name))
		try{
			data = trigger.run(access(data.q.query.user, data.q.query.passw, data.triggerData.name)?"allowed":"denied", data);
		}catch{}
		return data;
	});*/

	trigger.add("allowed", function(data){
		db.writeLine("accessGrantedLog.txt", data.q.query.user+"@"+data.req.socket.remoteAddress+" "+Date.now());
		return data;
	});

	trigger.add("denied", function(data){
		db.writeLine("accessFailedLog.txt", data.q.query.user+"@"+data.req.socket.remoteAddress+" "+Date.now());
		return data;
	});

	trigger.add("denied", function(data) {
		data.return.code = "403";
		data.return.output = "Not allowed";
		data.continue = false;
		return data;
	});
};