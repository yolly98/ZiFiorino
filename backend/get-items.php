<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = test($body->token);
    $username = "";

    if(test($body->type) != "get-items"){
        echo '{"status": "ERROR", "msg": "something went wrong"}';
        return;
    }

    // Verify and decode the token
    try {
        $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
        $username = test($decoded->username);
    } catch (Exception $e) {
        echo '{"status": "ERROR", "msg": "lost session"}';
        return;
    }

    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        echo '{"status": "ERROR", "msg": "connection failed to mysql:'.$conn->connect_error.'"}';
    }    
    $sql = "USE ".$NAME_DB.";";
    if(!$conn->query($sql)){
        echo '{"status": "ERROR", "msg": "connection failed to db"}';
        $conn->close();
        return;
    }


    // check if username exists
    $sql = "SELECT*from USER WHERE user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $user, $passw);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows <= 0){
        echo '{"status": "ERROR", "msg": "something went wrong"}';
        $conn->close();
        return;
    }

    $sql = "SELECT* from ITEM where user LIKE BINARY ?;";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    $array_data = array();
    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            
            $newItem = array(
                "id" => $row['id'],
                "item" => $row['item']
            );
            array_push($array_data, $newItem);
        }
        echo '{"status": "SUCCESS", "msg": '.json_encode($array_data).'}';
    }
    else
        echo '{"status": "SUCCESS", "msg": '.json_encode(array()).'}';

    $conn->close(); 

?>