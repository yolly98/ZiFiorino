<?php

    require '../config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $id = $body->id;

    if($token == null || $id == null){
        $response = [
            "status" => "ERROR",
            "msg" => -1
        ];
        echo json_encode($response);
        return;
    }

    // verify and decode the token
    $decoded_token = verify_token($token, $JWT_KEY);
    if($decoded_token == null){
        $response = [
            "status" => "ERROR",
            "msg" => -2
        ];
        echo json_encode($response);
        return;
    }

    $username = $decoded_token->username;
    $password = $decoded_token->password;
  
    // open mysql connection
    $mysql = new MySQL();
    $res = $mysql->open_connection($IP_ADDR, $USER_DB, $PASSW_DB, $NAME_DB);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }

    // get item from database
    $item = $mysql->get_item($id, $username);
    if($res == null){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }

    $encrypted_body =  hex2bin($item['body']);
    $iv = hex2bin($item['iv']);
    $body = decrypt($iv, $encrypted_body, $password);
    $response = [
        "status" => "SUCCESS",
        "item" => $body
    ];
    echo json_encode($response);

    $mysql->close_connection(); 
?>