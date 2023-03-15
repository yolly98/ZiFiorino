<?php

    include('../config.php');

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $item_id = $body->id;

    if($token == null || $item_id == null){
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

    //remove the item
    $res = $mysql->delete_item($item_id, $username);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -3
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
