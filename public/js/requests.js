class Requests{



    static setName(n){

        let data = {name: n}

        fetch('/setName', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},

            body: JSON.stringify(data)
        });
    }


    static setColor(c){

        let data = {color: c}

        fetch('/setColor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},

            body: JSON.stringify(data)
        }).then(() => { Requests.userInfo(); });
    }

    static switchChat(chat){

        let data = {chat: chat}

        fetch('/switchChat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},

            body: JSON.stringify(data)
        }).then(() => { Requests.userInfo(); });;
    }

    static showHistory(){

        fetch('/history', { method: 'GET', headers: {'Content-Type': 'application/json'}});
    }

    static newSession(){

        fetch('/clearSession', {method: 'GET', headers: {'Content-Type': 'application/json'}});
    }

    static timeParse(t){ return t < 10 ? '0' + t : t; }

    static loadToBox(mess){

        let chat = document.getElementById('chat-box');
    
        chat.innerHTML = '';

        for(let i = 0; i<mess.length; i++){


            let date = new Date(mess[i].date);


            let h = Requests.timeParse(date.getHours());
            let min = Requests.timeParse(date.getMinutes());

            let M = Requests.timeParse(date.getMonth());

            let neg_color = parseInt('FFFFFF', 16) - parseInt(mess[i].color, 16);

            if(neg_color > 5592405) neg_color = 16777215;
            else neg_color = 0;
            
            let parsed = h + ':' + min + '  |  ' + date.getDay() + '.' + M;

            let mess_div = '<div class="mess-div"> <div class="author" id="A' + i +'">' + mess[i].author + ' </div>';

            mess_div += '<div class="mess-text" id="T' + i +'">' + mess[i].text + ' </div>';

            mess_div += '<div class="mess-date">' + parsed + ' </div> </div>';

            chat.innerHTML += mess_div;

            let IDA = 'A' + i;
            let IDT = 'T' + i;

            let color_str = neg_color.toString(16);

            if(color_str == '0') color_str = '000000'; 

            document.getElementById(IDA).style.color = '#' + mess[i].color;
            document.getElementById(IDT).style.backgroundColor = '#' + mess[i].color;
            document.getElementById(IDT).style.color = '#' + color_str;
        } 
        
        $('#chat-box').emoticonize({delay: 20});


        document.getElementById('chat-box').lastChild.scrollIntoView();
    }


    static sendMessage(mess){

        let data = {text: mess}

        fetch('/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},

            body: JSON.stringify(data)
        }).then(response => response.json()).then(data => { Requests.loadToBox(data.messages); });
    }


    static userInfo(){

        fetch('/user', {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(response => response.json()).then(data => {

            let user = data.user;
    
            document.getElementById('ucolor').style.backgroundColor = '#' + user.color;
            document.getElementById('chat-name').innerText = user.chat;
            document.getElementById('user-name').innerText = user.nick;
        });
    }

    static wiped(){

        fetch('/wiped', {method: 'GET', headers: {'Content-Type': 'application/json'}}).then(response => response.json()).then(data => { 
            
            Requests.loadToBox(data.messages); 
            Requests.newMessages();   
        });
    }


    static async newMessages(){

        let res = await fetch('/messages', {method: 'GET', headers: {'Content-Type': 'application/json'}});
        let data = await res.json();

        window.setTimeout(() => { document.getElementById('mess').focus(); }, 1);
        
        Requests.loadToBox(data.messages); 
        Requests.newMessages();   
    }
}