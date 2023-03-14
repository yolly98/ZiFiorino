<?php

    require 'config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $new_passw = $body->password;

    if($token == null || $new_passw == "" || $new_passw == null){
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
    $old_passw = $decoded_token->password;
  
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

    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
        
            // encrypt item with the new passoword
            $id = $row['id'];
            $encrypted_body = hex2bin($row['body']);
            $iv = hex2bin($row['iv']);
            $body = decrypt($iv, $encrypted_body, $old_passw);
            $iv = generate_iv();
            $encrypted_body = encrypt($iv, $body, generate_hash($new_passw));

            //update the item
            $sql="UPDATE ITEM SET iv = ?, body = ? WHERE id LIKE BINARY ? AND user LIKE BINARY ?";
            $stmt=$conn->prepare($sql);
            $stmt->bind_param("ssis", bin2hex($iv), bin2hex($encrypted_body), $id, $username);
            $stmt->execute();
        }

    }

    //update password on user table
    $sql="UPDATE USER SET passw = ? WHERE user LIKE BINARY ?";
    $stmt=$conn->prepare($sql);
    $stmt->bind_param("ss", generate_hash_with_salt($new_passw), $username);
    $stmt->execute();

    $response = [
        "status" => "SUCCESS",
        "items" => json_encode(array())
    ];
    echo json_encode($response);

    $conn->close(); 
?>