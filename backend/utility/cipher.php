<?php

require_once 'firebase-php-jwt/JWT.php';
require_once 'firebase-php-jwt/Key.php';
require_once 'firebase-php-jwt/ExpiredException.php';
require_once 'firebase-php-jwt/BeforeValidException.php';
require_once 'firebase-php-jwt/SignatureInvalidException.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

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

function generate_hash_with_salt($key){
    
    return password_hash($key, PASSWORD_DEFAULT);
}

function generate_hash($key){
    return hash('sha256', $key);
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

?>