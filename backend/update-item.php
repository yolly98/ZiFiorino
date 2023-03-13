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

    // prepare the item
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

    //update the item
    $sql="UPDATE ITEM SET name = ?, urlImage = ?, iv = ?, body = ? WHERE id LIKE BINARY ? AND user LIKE BINARY ?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ssssis", $name, $urlImage, bin2hex($iv), bin2hex($encrypted_body), $item->id, $username);
    $stmt->execute();
    
    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $conn->close();

?>