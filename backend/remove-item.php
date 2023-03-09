<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = test($body->token);
    $username = "";
    $id = null;

    // Verify and decode the token
    try {
        $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
        $username = $decoded->username;
        $id = test($decode->id);
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

    //remove the item
    $sql = "DELETE FROM ITEM WHERE id LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    //check if the item exists
    $sql = "SELECT * from ITEM WHERE id LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows > 0)
        echo '{"status": "ERROR", "msg": "something went wrong"}';
    else
       echo '{"status": "SUCCESS"}';
    
    $conn->close();

    function test($data){

        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

?>
