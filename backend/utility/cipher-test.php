
<?php

require 'cipher.php';

$username = "test";
$password = "abc123";

$digest = generate_hash_with_salt($password);
echo "HASH: ";
echo $digest . "<br>";

$res = verify_hash($password, $digest);
if($res)
    echo "hash verfy: true<br>";
else
    echo "hash verfy: false<br>";

$msg = "hello world!";
$iv = generate_iv();
$key = generate_hash($password);
echo "IV: ";
print_hex($iv);
echo "KEY: " . $key . "<br>";

$ciphertext = encrypt($iv, $msg, $key);
echo "CIPHERTEXT: ";
print_hex($ciphertext);

$plaintext = decrypt($iv, $ciphertext, $key);
echo "PLAINTEXT: ";
echo $plaintext . "<br>";

$jwt_key = "secret jwt key";
$token = generate_token($username, $key, 1, $jwt_key);

$token_payload = verify_token($token, $jwt_key);
if($token_payload == null)
    echo "token non verificato<br>";
else
    echo json_encode($token_payload) . "<br>";
 ?>