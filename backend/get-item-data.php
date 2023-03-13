<?php

    require 'config.php';

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
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }

    $username = $decoded_token->username;
  
    // create mysql connection
    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }    
    $sql = "USE " . $NAME_DB . ";";
    if(!$conn->query($sql)){
        $response = [
            "status" => "ERROR",
            "msg" => -5
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }

    // get item from database
    $sql = "SELECT* FROM ITEM WHERE id LIKE BINARY ? AND user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $id, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $encrypted_body;
    $iv;

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            $encrypted_body = hex2bin($row['body']);
            $iv = hex2bin($row['iv']);
            break;
        }

        $body = decrypt($iv, $encrypted_body, $decoded_token->password);
        $response = [
            "status" => "SUCCESS",
            "item" => $body
        ];
        echo json_encode($response);
    }
    else{
        $response = [
            "status" => "ERROR",
            "msg" => -6
        ];
        echo json_encode($response);
    }

    $conn->close(); 
?>