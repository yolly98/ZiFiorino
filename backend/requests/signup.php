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

// check if user already exists
$user = $mysql->get_user($username);
if($user != null){
    $response = [
        "status" => "ERROR",
        "msg" => -3
    ];
    echo json_encode($response);
    return;
}

// save new user in the database
$user = [
    'username' => $username,
    'password' => generate_hash_with_salt($password)
];
$res =$mysql->create_user($user);
if(!$res){
    $response = [
        "status" => "ERROR",
        "msg" => -4
    ];
    echo json_encode($response);
    return;
}

//create user folder for backup
$folder_name = generate_hash($username);
if (!file_exists('../data/'.$folder_name))
    mkdir('../data/'.$folder_name);

$response = [
    "status" => "SUCCESS"
];
echo json_encode($response);

$mysql->close_connection();

?>