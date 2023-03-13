<?php

    require 'config.php';

    $body = json_decode($_POST['body']);
    $token = test($body->token);
    $username = "";

    if(test($body->type) != "get-items"){
        $response = [
            "status" => "ERROR",
            "msg" => -1
        ];
        echo json_encode($response);
        return;
    }

    // Verify and decode the token
    try {
        $decoded = verify_token($token, $JWT_KEY);
        $username = test($decoded->username);
    } catch (Exception $e) {
        $response = [
            "status" => "ERROR",
            "msg" => -2
        ];
        echo json_encode($response);
        return;
    }

    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        echo '{"status": "ERROR", "msg": "connection failed to mysql:'.$conn->connect_error.'"}';
    }    
    $sql = "USE ".$NAME_DB.";";
    if(!$conn->query($sql)){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }


    // check if username exists
    $sql = "SELECT* from USER WHERE user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows <= 0){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
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


    function test($data){

        $data=trim($data);
        $data=stripslashes($data);
        $data=htmlspecialchars($data);
        return $data;
    }

?>