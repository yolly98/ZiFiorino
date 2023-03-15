<?php

    require '../config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;

    if($token == null){
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

    // get all items of the user from database
    $items = $mysql->get_items($username);
    if($res == null){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }
    
    $array_data = array();
    foreach($items as $item){
        $newItem = [
            "id" => $item['id'],
            "name" => $item['name'],
            "urlImage" => $item['urlImage']
        ];
        array_push($array_data, $newItem);
    }

    $response = [
        "status" => "SUCCESS",
        "items" => json_encode($array_data)
    ];
    echo json_encode($response);

    $mysql->close_connection(); 
?>