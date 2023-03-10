<?php

require_once './firebase-php-jwt/JWT.php';
require_once './firebase-php-jwt/Key.php';
require_once './firebase-php-jwt/ExpiredException.php';
require_once './firebase-php-jwt/BeforeValidException.php';
require_once './firebase-php-jwt/SignatureInvalidException.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;


$JWT_KEY = 'my_secret_key'; 

function generate_iv(){
    $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length('aes-256-cbc'));
    return $iv;
}


function encrypt($iv, $plaintext, $key){

    return openssl_encrypt($plaintext, "aes-256-cbc", $key, 0, $iv);
}


function decrypt($iv, $ciphertext, $key){

    return openssl_decrypt($ciphertext, "aes-256-cbc", $key, 0, $iv);
} 

function generate_hash($key){
    
    return password_hash($key, PASSWORD_DEFAULT);
}

function verify_hash($key, $digest){

    return password_verify($key, $digest);
}

function generate_token($username, $password, $minutes, $key){

    $expiration_time = time() + (60 * $minutes); 
    $payload = array(
        "username" => $username,
        "password" => $password,
        "exp" => $expiration_time
    );

    $token = JWT::encode($payload, $key, 'HS256');
    return $token;
}

function verify_token($token, $key){

    try{
        $payload = JWT::decode($token, new Key($key, 'HS256'));
        return $payload;
    }catch(Exception $e) {
        return null;
    }
}

function print_hex($bytes){
    $hex = "";
    foreach (str_split($bytes) as $byte){
        $hex .= dechex(ord($byte));
    }
    echo $hex . "<br>";
}

//test

$username = "test";
$password = "abc123";

$digest = generate_hash($password);
echo "HASH: ";
echo $digest . "<br>";

$res = verify_hash($password, $digest);
if($res)
    echo "hash verfy: true<br>";
else
    echo "hash verfy: false<br>";

$msg = "hello world!";
$iv = generate_iv();
echo "IV: ";
print_hex($iv);

$ciphertext = encrypt($iv, $msg, $digest);
echo "CIPHERTEXT: ";
print_hex($ciphertext);

$plaintext = decrypt($iv, $ciphertext, $digest);
echo "PLAINTEXT: ";
echo $plaintext . "<br>";


$token = generate_token($username, $digest, 1, $JWT_KEY);

$token_payload = verify_token($token, $JWT_KEY);
if($token_payload == null)
    echo "token non verificato<br>";
else
    echo json_encode($token_payload) . "<br>";


?>