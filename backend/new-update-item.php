<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = test($body->token);
    $username = "";
    $id = null;
    $item = "";

    // Verify and decode the token
    try {
        $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
        $username = $decoded->username;
        $id = $decode->id;
        $item = test($decode->item);
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
    $stmt->bind_param("ss",$user,$passw);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows<=0){
        echo '{"status": "ERROR", "msg": "something went wrong"}';
        $conn->close();
        return;
    }

    if(test($body->type) == "new"){

        //save new item
        $sql = "INSERT INTO ITEM VALUES(0, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $username, $item);
        $stmt->execute();

        //get the id assigned to the item
        $sql = "SELECT id from ITEM WHERE user LIKE BINARY ? ORDER BY id DESC LIMIT 1;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s",$username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows <= 0){
            echo '{"status": "ERROR", "msg": "something went wrong"}';
            $conn->close();
            return;
        }
        else
            while($row = $result->fetch_assoc()){
                $id = $row['id'];
            }

        echo '{"status": "SUCCESS", "id": '.$id.'}';
    }
    else{

        //update the item
        $sql="UPDATE ITEM SET item=? WHERE id LIKE BINARY ?";
        $stmt=$conn->prepare($sql);
        $stmt->bind_param("si",$item, $id);
        $stmt->execute();
        
        echo '{"status": "SUCCESS"}';
    }


    $conn->close();

    function test($data){

        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

?>