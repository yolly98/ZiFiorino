<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $token = test($body->token);
    $username = "";
    $password = "";
    $item = $body->item;
    $id = $item->id;

    // Verify and decode the token
    try {
        $decoded = verify_token($token, $JWT_KEY);
        $username = $decoded->username;
        $password = $decoded->password;
    } catch (Exception $e) {
        $response = [
            "status" => "ERROR",
            "msg" => -1
        ];
        echo json_encode($response);
        return;
    }

    $conn = new mysqli($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        $response = [
            "status" => "ERROR",
            "msg" => -2
        ];
        echo json_encode($response);
        return;
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
    $sql = "SELECT*from USER WHERE user LIKE BINARY ?;";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s",$username);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows<=0){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        $conn->close();
        return;
    }

    // +----+------+------+----------+----+------+
    // | id | user | name | urlImage | iv | body |
    // +----+------+------+----------+----+------+

    $name = $item->name;
    $urlImage = $item->urlImage;
    $body = [
        "username" => $item->username,
        "password" => $item->password,
        "notes" => $item->notes
    ];
    $body = json_encode($body);
    $key = generate_hash($password);
    $iv = generate_iv();
    $encrypted_body = encrypt($iv, $body, $key);

    if($body->type == "new"){

        //save new item
        $sql = "INSERT INTO ITEM VALUES(0, ?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssss", $username, $name, $urlImage, bin2hex($iv), bin2hex($encrypted_body));
        $stmt->execute();

        // TODO si rompe qui
        $response = [
            "status" => "ERROR",
            "msg" => -10
        ];
        echo json_encode($response);
        $conn->close();
        return;

    
        //get the id assigned to the item
        $sql = "SELECT id from ITEM WHERE user LIKE BINARY ? ORDER BY id DESC LIMIT 1;";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows <= 0){
            $response = [
                "status" => "ERROR",
                "msg" => -5
            ];
            echo json_encode($response);
            $conn->close();
            return;
        }
        else
            while($row = $result->fetch_assoc()){
                $id = $row['id'];
            }

        $response = [
            "status" => "SUCCESS",
            "id" => $id
        ];
        echo json_encode($response);
    }
    else{

        //update the item
        $sql="UPDATE ITEM SET name = ?, urlImage = ?, iv = ?, body = ? WHERE id LIKE BINARY ?";
        $stmt=$conn->prepare($sql);
        $stmt->bind_param("ssssi",$name, $urlImage, $iv, $encrypted_body);
        $stmt->execute();
        
        $response = [
            "status" => "SUCCESS"
        ];
        echo json_encode($response);
    }


    $conn->close();

    function test($data){

        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

?>