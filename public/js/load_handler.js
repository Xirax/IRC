var MESS_TEXT = "";

document.getElementById('mess').addEventListener('change', function(e){ MESS_TEXT = e.target.value; });

document.addEventListener('keyup', (e) => { 

    if(e.key == 'Enter') getMessage();
})


function getMessage(){

    document.getElementById('mess').value = '';

    if(Commands.analize(MESS_TEXT)) Commands.run(MESS_TEXT);
    else Requests.sendMessage(MESS_TEXT);
}


function check(){  Requests.userInfo(); }

function messages(){ Requests.wiped(); }