<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="scripts/jquery-3.6.0.min.js"></script>
    <script>
    
function alp(){
    $.ajax({
        method: "GET",
        url: "ajax.php",
        dataType: "json"
    })
    .done(function( msg ) {
        console.log("success", msg );
    })
    .always(function(){
        alp();
    });
}
    </script>
</head>
<body onload="alp();">
    
</body>
</html>

<?php
$time=time();
$old_data=""; //    id/czas
while(time()-$time<=5){
    $new_data=""; //   id/czas
    if($old_data!=$new_data){
        $json=Array(
            "test"=>"lol"
        ); //np. dane z bazy
        echo json_encode($json);
        break;
    }
    usleep(5000);
}