<?php

    require '../config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $old_file_name = $body->old_file_name;
    $new_file_name = $body->new_file_name;

    if($token == null || $old_file_name == null || $new_file_name == null){
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

    // remove old backup
    $file_path = "../data/" . generate_hash($username) . "/" . $old_file_name;
    if($old_file_name != "new" && file_exists($file_path))
        unlink($file_path);
  
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
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }

    // save backup in a json file
    $json = json_encode($items);
    $file_path = "../data/" . generate_hash($username) . "/" . $new_file_name;
    if(file_exists($file_path))
        unlink($file_path);
    file_put_contents($file_path, $json);

    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $mysql->close_connection(); 
?>