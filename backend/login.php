<?php

require 'config.php';    

$body = json_decode($_POST['body']);
$user = $body->user;
$passw = $body->passw;

if($user == "" || $passw == "" || $user == null || $passw == null){
    $response = [
        "status" => "ERROR",
        "msg" => -1
    ];
    echo json_encode($response);
    return;
}

// create mysql connection
$conn = mysqli_connect($IP_ADDR, $USER_DB, $PASSW_DB);
if(!$conn){
    $response = [
        "status" => "ERROR",
        "msg" => -2
    ];
    echo json_encode($response);
    return;
}

$sql = "USE " . $NAME_DB . ";";
if(!$conn->query($sql)){
    $response = [
        "status" => "ERROR",
        "msg" => -3
    ];
    echo json_encode($response);
    $conn->close();
    return;
}

// check if username exits
$sql = "SELECT* FROM USER WHERE user LIKE BINARY ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0){

    // check if password is correct
    while($row = $result->fetch_assoc()){
        $hashedPassw = $row['passw'];
        if(verify_hash($passw, $hashedPassw)){
            // generate token
            $expiration_time = 30; // minutes
            $passw = generate_hash($passw);
            $token = generate_token($user, $passw, $expiration_time, $JWT_KEY);

            $response = [
                "status" => "SUCCESS",
                "token" => $token
            ];
            echo json_encode($response);
        }
        else{
            $response = [
                "status" => "ERROR",
                "msg" => -4
            ];
            echo json_encode($response);
        }
    }
}
else{
    $response = [
        "status" => "ERROR",
        "msg" => -5
    ];
    echo json_encode($response);
}

$conn->close();

?>