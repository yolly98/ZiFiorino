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

// check if user already exists
$sql = "SELECT* FROM USER WHERE user LIKE BINARY ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s",$user);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows == 0){

    // save new user in the database
    $sql="INSERT INTO USER VALUES(?, ?)";
    $stmt = $conn->prepare($sql);
    $passw = generate_hash_with_salt($passw);
    $stmt->bind_param("ss",$user, $passw);
    $stmt->execute();

    $response = [
        "status" => "SUCCESS"
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

$conn->close();

?>