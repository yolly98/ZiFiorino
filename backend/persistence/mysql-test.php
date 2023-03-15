<?php

require 'mysql.php';

$IP_ADDR = '172.20.0.11';
$USER_DB = 'root';
$PASSW_DB = 'password';
$NAME_DB = 'zifiorino_db';

$mysql = new MySQL();
$mysql->open_connection($IP_ADDR, $USER_DB, $PASSW_DB, $NAME_DB);

$user = [
    'username' => 'user-test',
    'password' => 'password-test'
];

$item = [
    'id' => 0,
    'user' => $user['username'],
    'name' => 'name-test',
    'urlImage' => 'url-test',
    'iv' => 'iv-test',
    'body' => 'body-test'
];

$res = $mysql->create_user($user);
echo "CREATE USER: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->get_user($user['username']);
echo "GET USER: ";
if($res != null) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$user['password'] = '1111';
$res = $mysql->update_user($user);
echo "UPDATE USER: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->create_item($item);
echo "CREATE ITEM: ";
if($res){ 
    echo "true";
}
else 
    echo "false";
echo "<br>";

$res = $mysql->get_item($item['id'], $user['username']);
echo "GET ITEM: ";
if($res != null) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->update_item($item);
echo "UPDATE ITEM: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->create_item($item);
$res = $mysql->create_item($item);
$res = $mysql->create_item($item);

$res = $mysql->get_items($user['username']);
echo "GET ITEMS: ";
if($res != null) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->delete_item($item['id'], $item['username']);
echo "DELETE ITEM: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->delete_all_items($user['username']);
echo "DELETE ITEMS: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$res = $mysql->delete_user($user['username']);
echo "DELETE USER: ";
if($res) 
    echo "true"; 
else 
    echo "false";
echo "<br>";

$mysql->close_connection();



?>