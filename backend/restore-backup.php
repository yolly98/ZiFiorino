<?php

    require 'config.php';

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
    $file_path = "data/" . generate_hash($username) . "/" . $file_name;
    if(!file_exists($file_path)){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }

    // read backup
    $file_json = file_get_contents($file_path);
    $data = json_decode($file_json);
  
    // create mysql connection
    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }    
    $sql = "USE " . $NAME_DB . ";";
    if(!$conn->query($sql)){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }

    // delete all item of the user
    $sql = "DELETE FROM ITEM WHERE user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();

    // import backup in the database
    foreach($data as $item){
        $id = $item->id;
        $user = $item->user;
        $name = $item->name;
        $urlImage = $item->urlImage;
        $iv = $item->iv;
        $body = $item->body;

        //restore item
        $sql = "INSERT INTO ITEM VALUES(?, ?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isssss", $id, $user, $name, $urlImage, $iv, $body);
        $stmt->execute();
    }

    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $conn->close(); 
?>