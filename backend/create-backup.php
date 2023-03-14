<?php

    require 'config.php';

    $body = json_decode($_POST['body']);
    $token = $body->token;
    $file_name = $body->file_name;

    if($token == null || $file_name == null){
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

    // remove old backup
    $file_path = "data/" . generate_hash($username) . "/" . $file_name;
    if($file_name != "new" && file_exists($file_path))
        unlink($file_path);
  
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
        
            $item = [
                "id" => $row['id'],
                "user" => $row['user'],
                "name" => $row['name'],
                "urlImage" => $row['urlImage'],
                "iv" => $row['iv'],
                "body" => $row['body']
            ];
            array_push($array_data, $item);
        }
    }

    // save backup in a json file
    $json = json_encode($array_data);
    $file_name = date('Y-m-d,H_i_s') . '.json';
    $file_path = "data/" . generate_hash($username) . "/" . $file_name;
    if(file_exists($file_path))
        unlink($file_path);
    file_put_contents($file_path, $json);

    $response = [
        "status" => "SUCCESS",
        "backup" => $file_name
    ];
    echo json_encode($response);

    $conn->close(); 
?>