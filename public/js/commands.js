class Commands{


    static analize(txt){
        if(txt[0] =='/') return true;
        else return false;
    }   


    static run(cmd){

        let args = cmd.split(' ');

        if(args[0] == "/color") Requests.setColor(args[1]);
        else if(args[0] == "/name")Requests.setName(args[1]);   
        else if(args[0] == "/chat") Requests.switchChat(args[1]);
        else if (args[0] == "/history") Requests.showHistory();
        else if(args[0] == "/quit") Requests.newSession();
    }
}