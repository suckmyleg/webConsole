var http = require('http');
var url = require('url');



//TRIGGERS 
var TRIGGERS = {};

function runTrigger(name, data={}){
  //Create data needed to run
  let newData = null;
  let funs = TRIGGERS[name];
  if(name != "*") data.triggerData = {
    continue:true,
    name:name
  };  


  //Call triggers oriented to everysingle one
  if(name!="*"){
    //Save process to data if its from request
    try{
      data.return.processes.push(name);
    }catch{}

    data = runTrigger("*", data);
  }




  //Call every function from TRIGGERS[name]
  if(funs != null){
    for(let fun of funs){
      if(!data.triggerData.continue) break;
      newData = fun(data);
      if(newData != null){
        data = newData;
      }
    }
  }


  return data;
}

function addTrigger(name, fun){
  try{
    TRIGGERS[name].push(fun);
  }catch{
    TRIGGERS[name] = [fun];
  }
}






//SETUP
var trigger = {"run":runTrigger, "add":addTrigger};

var db = require('./db');
db.setup(trigger, null);

var main = require('./main');
main.setup(trigger, db.db);

var access = require('./access');
access.setup(trigger, db.db);

var commands = require('./commands');
commands.setup(trigger, db.db);

var chat = require('./chat');
chat.setup(trigger, db.db);













//SERVER


http.createServer(function (req, res) {
  let q = url.parse(req.url, true);

  let data = {"req":req, "res":res, "q":q, "continue":true, "head":{
    "code":200,
    "data":{'Content-Type': 'application/json'}
  },
  "return":{
    "code":"200",
    "output":"",
    "processes":[]
  }};

  //trigger.add("request", function(data){console.log(data);});

  data = trigger.run("request", data);
  //data = trigger.run("beforesend", data);

  console.log(data.return);

  res.writeHead(data.head.code, data.head.data);
  res.end(JSON.stringify(data.return));
}).listen(8080, '192.168.1.208');
