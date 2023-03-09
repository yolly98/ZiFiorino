<?php

require_once './firebase-php-jwt/JWT.php';
use Firebase\JWT\JWT;

header("Access-Control-Allow-Origin: *");

$IP_ADDR = '172.20.0.11';
$USER_DB = 'root';
$PASSW_DB = 'password';
$NAME_DB = 'zifiorino_db';
$JWT_KEY = 'my_secret_key'; 

?>