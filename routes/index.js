const express = require('express');
const router = express.Router();

const path = require('path');
const html_path = '../public/html';



var id_increment = 0;

var chats = [
  { name: 'PUBLIC', messages: [] }
];

router.get('/', function(req, res) {

  res.sendFile(path.join(__dirname, html_path, 'index.html'));
});

function createUser(req){

  let hex = ['A', 'B', 'C', 'D', 'E', 'F'];

  let random_color = '';

  
  for(let i=0; i<6; i++){

    let block = Math.round(Math.random() * 15);

    if(block > 9) block = hex[block - 10];

    random_color += block.toString();
  }

  req.session.nick = "Anon";
  req.session.uColor = random_color;
  req.session.userID = id_increment++;
  req.session.chat = "PUBLIC";
  req.session.lastMess = chats[0].messages.length;
  req.session.firstMess = chats[0].messages.length;
  req.session.pending = false;
}


function recycle(){

  for(let i=0; i<chats.length; i++){

    for(let j=0; j<chats[i].messages.length; j++){

      if(Date.now() -  chats[i].messages[j].date > (1000 * 3600 * 24)){
        
        chats[i].messages = chats[i].messages.slice(0, j);
        break;
      } 
    }
  }
}


async function waitForNewMessage(last, chname){

  return new Promise(resolve => {

    let itr = 0;
    let chat = chats.filter((ch) => { if(ch.name == chname) return ch; });

    if(chat[0].messages.length > last) resolve(chat[0].messages);

    setInterval(() => {

      if(chat[0].messages.length > last) resolve(chat[0].messages);
      else if(++itr > 80) resolve(chat[0].messages);
    }, 500);
  });
}


router.post('/setColor', function(req, res){

  let data = req.body;

  if(data.color[0] == '#') data.color = data.color.substring(1);
  if(data.color.length > 6 || data.color.length < 6) data.color = '000000';
  
  req.session.uColor = data.color;

  req.session.save();
  res.send({value: req.session.uColor});
});

router.post('/setName', function(req, res){

  let data = req.body;

  req.session.nick = data.name;

  req.session.save();
  res.send({value: req.session.nick});
});

router.get('/history', function(req, res){

  req.session.firstMess = 0;

  req.session.save();
  res.sendFile(path.join(__dirname, html_path, 'index.html'));
});


router.get('/clearSession', function(req, res){

  req.session.destroy();
  res.sendFile(path.join(__dirname, html_path, 'index.html'));
});

router.post('/switchChat', function(req, res){

  let data = req.body;

  req.session.chat = data.chat;

  let filter = chats.filter((ch) => { if(ch.name == data.chat) return ch; });

  if(filter.length == 0) 
  { 
    chats.push({name: data.chat, messages: []});
    req.session.firstMess = chats[chats.length - 1].messages.length;
    req.session.lastMess = chats[chats.length - 1].messages.length;
  }
  else{
    req.session.firstMess = filter[0].messages.length;
    req.session.lastMess = filter[0].messages.length;
  }

  req.session.save();
  res.send({value: req.session.chat});
});

router.get('/user', function(req, res){

  if(req.session.userID === undefined) createUser(req);

  let user = {
    nick: req.session.nick,
    color: req.session.uColor,
    chat: req.session.chat
  }

  req.session.save();
  res.send({user: user});
});


router.get('/messages', async function(req, res){

  if(req.session.userID !== undefined){

    let messages = await waitForNewMessage(req.session.lastMess, req.session.chat);
    req.session.lastMess = messages.length;

    let splited = messages.slice(req.session.firstMess, messages.length);

    req.session.save();
    res.send({messages: splited});

    recycle();
  }
})

router.get('/wiped', function(req, res){

  req.session.lastMess = req.session.firstMess;
  req.session.save();

  res.redirect('/messages');
})


router.post('/sendMessage', function(req, res){

  let data = req.body;

  let splited = [];

  for(let i=0; i<chats.length; i++){

    if(chats[i].name == req.session.chat){

      chats[i].messages.push({author: req.session.nick, color: req.session.uColor, text: data.text, date: Date.now()});
      splited = chats[i].messages.slice(req.session.firstMess, chats[i].messages.length);

      break;
    }
  }

  req.session.save();

  res.send({messages: splited});
})

module.exports = router;
