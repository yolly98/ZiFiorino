<?php

    include('config.php');

    $body = json_decode($_POST['body']);
    $user = test($body->user);
    $passw = test($body->passw);

    if($user == "" || $passw == ""){
        echo '{"status": "ERROR", "msg": "empty values"}';
        return;
    }

    $conn = mysqli_connect($IP_ADDR, $USER_DB, $PASSW_DB);
    if(!$conn){
        echo '{"status": "ERROR", "msg": "connection failed to mysql:'.$conn->connect_error.'"}';
    }

    $sql = "USE ".$NAME_DB.";";
    if(!$conn->query($sql)){
        echo '{"status": "ERROR", "msg": "connection failed to db"}';
        $conn->close();
        return;
    }

    if(test($body->type) == 'login'){

        // check if username and password are correct
        $sql = "SELECT* FROM USER WHERE user LIKE BINARY ? passw LIKE BINARY ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $user, $passw);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->num_rows > 0){
            // generate token
            $expiration_time = time() + (30 * 60); // 30 minutes
            $payload = array(
                "username" => $username,
                "exp" => $expiration_time
            );
            $token = JWT::encode($payload, $JWT_KEY);

            echo '{"status": "SUCCESS", "token": "'.$token.'"}';
        }
        else{
            echo '{"status": "ERROR", "msg": "user name or password not correct"}';
        }
        
        $conn->close();
        
    }

    if(test($body->type) == 'signup'){

        $sql = "SELECT* FROM USER WHERE user LIKE BINARY ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s",$user);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if($result->num_rows == 0){

            $sql="INSERT INTO USER VALUES(?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss",$user,$passw);
            $stmt->execute();

            echo '{"status": "SUCCESS"}';
        }
        else{
            echo '{"status": "ERROR", "msg": "Username already exists"}';
        }

        $conn->close();

    }

    function test($data){

        $data=trim($data);
        $data=stripslashes($data);
        $data=htmlspecialchars($data);
        return $data;
    }

?>