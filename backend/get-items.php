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

    // get all items of the user from database
    $sql = "SELECT* FROM ITEM WHERE user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    $array_data = array();
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            
            $newItem = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "urlImage" => $row['urlImage']
            );
            array_push($array_data, $newItem);
        }
        $response = [
            "status" => "SUCCESS",
            "items" => json_encode($array_data)
        ];
        echo json_encode($response);
    }
    else{
        $response = [
            "status" => "SUCCESS",
            "items" => json_encode(array())
        ];
        echo json_encode($response);
    }

    $conn->close(); 
?>