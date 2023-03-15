<?php

    include('../config.php');

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $item = $body->item;

    if($token == null || $item == null){
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

    // prepare the item
    $id = $item->id;
    $name = $item->name;
    $urlImage = $item->urlImage;
    $body = [
        "username" => $item->username,
        "password" => $item->password,
        "notes" => $item->notes
    ];
    $body = json_encode($body);
    $key = $password;
    $iv = generate_iv();
    $encrypted_body = encrypt($iv, $body, $key);

    $item_db = [
        'id' => $id,
        'user' => $username,
        'name' => $name,
        'urlImage' => $urlImage,
        'iv' =>  bin2hex($iv),
        'body' => bin2hex($encrypted_body)
    ];

    //update the item
    $res = $mysql->update_item($item_db);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }
    
    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $mysql->close_connection();

?>