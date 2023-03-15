<?php

    require '../config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $file_name = $body->file_name;

    if($token == null || $file_name == null){
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

    // check if the backup exists
    $file_path = "../data/" . generate_hash($username) . "/" . $file_name;
    if(!file_exists($file_path)){
        $response = [
            "status" => "ERROR",
            "msg" => -3
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
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }

    // delete all item of the user
    $res = $mysql->delete_all_items($username);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -5
        ];
        echo json_encode($response);
        return;
    }

    // read backup
    $file_json = file_get_contents($file_path);
    $data = json_decode($file_json);

    // import backup in the database
    foreach($data as $item){

        //restore item
        $item_db = (array)$item;
        $res = $mysql->create_item($item_db);
        if(!$res){
            $response = [
                "status" => "ERROR",
                "msg" => -6
            ];
            echo json_encode($response);
            return;
        }    
    }

    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $mysql->close_connection(); 
?>