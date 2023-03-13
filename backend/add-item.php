<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $item = $body->item;
    $id = $item->id;

    if($token == null || $item == null){
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
    $password = $decoded_token->password;

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
    
    // prepare new item
    $name = $item->name;
    $urlImage = $item->urlImage;
    $body = [
        "username" => $item->username,
        "password" => $item->password,
        "notes" => $item->notes
    ];
    $body = json_encode($body);
    $key = $password;
    $iv = generate_iv();
    $encrypted_body = encrypt($iv, $body, $key);

    //save new item
    $sql = "INSERT INTO ITEM VALUES(0, ?, ?, ?, ?, ?);";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $username, $name, $urlImage, bin2hex($iv), bin2hex($encrypted_body));
    $stmt->execute();

    //get the id assigned to the item
    $sql = "SELECT id from ITEM WHERE user LIKE BINARY ? ORDER BY id DESC LIMIT 1;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if($result->num_rows <= 0){
        $response = [
            "status" => "ERROR",
            "msg" => -6
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }
    else{
        while($row = $result->fetch_assoc()){
            $id = $row['id'];
        }
    }

    $response = [
        "status" => "SUCCESS",
        "id" => $id
    ];
    echo json_encode($response);

    $conn->close();

?>