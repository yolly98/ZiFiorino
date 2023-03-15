<?php

require '../config.php';    

$body = json_decode($_POST['body']);
$username = $body->user;
$password = $body->passw;

if($username == "" || $password == "" || $username == null || $password == null){
    $response = [
        "status" => "ERROR",
        "msg" => -1
    ];
    echo json_encode($response);
    return;
}

// open mysql connection
$mysql = new MySQL();
$res = $mysql->open_connection($IP_ADDR, $USER_DB, $PASSW_DB, $NAME_DB);
if(!$res){
    $response = [
        "status" => "ERROR",
        "msg" => -2
    ];
    echo json_encode($response);
    return;
}

// check if username exits
$user = $mysql->get_user($username);
if($res == null){
    $response = [
        "status" => "ERROR",
        "msg" => -3
    ];
    echo json_encode($response);
    return;
}

if(verify_hash($password, $user['password'])){
    // generate token
    $expiration_time = 30; // minutes
    $password = generate_hash($password);
    $token = generate_token($username, $password, $expiration_time, $JWT_KEY);

    $response = [
        "status" => "SUCCESS",
        "token" => $token
    ];
    echo json_encode($response);
}
else{
    $response = [
        "status" => "ERROR",
        "msg" => -4
    ];
    echo json_encode($response);
}

$mysql->close_connection();

?>