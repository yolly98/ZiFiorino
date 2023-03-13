<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $item_id = $body->id;

    if($body->type != "remove-item"){
        $response = [
            "status" => "ERROR",
            "msg" => -1
        ];
        echo json_encode($response);
        return;
    }

    if($token == null || $item_id == null){
        $response = [
            "status" => "ERROR",
            "msg" => -2
        ];
        echo json_encode($response);
        return;
    }

    // Verify and decode the token
    $decoded_token = verify_token($token, $JWT_KEY);
    if($decoded_token == null){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }

    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }    
    $sql = "USE ".$NAME_DB.";";
    if(!$conn->query($sql)){
        $response = [
            "status" => "ERROR",
            "msg" => -5
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }

    //remove the item
    $sql = "DELETE FROM ITEM WHERE id LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();

    //check if the item exists
    $sql = "SELECT * from ITEM WHERE id LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows > 0){
        $response = [
            "status" => "ERROR",
            "msg" => -6
        ];
        echo json_encode($response);
    }
    else{
        $response = [
            "status" => "SUCCESS"
        ];
        echo json_encode($response);
    }

    $conn->close();

?>
