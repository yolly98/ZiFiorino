<?php

    require 'config.php';

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
    
    // remove old backup
    $file_path = "data/" . generate_hash($username) . "/*";
    $files = glob($file_path);
    $file_names = array();
    foreach($files as $file)
        array_push($file_names, basename($file));
    
    $response = [
        "status" => "SUCCESS",
        "backups" => $file_names
    ];
    echo json_encode($response);
?>