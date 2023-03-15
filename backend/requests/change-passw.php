<?php

    require '../config.php';

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
  
    // open mysql connection
    $mysql = new MySQL();
    $res = $mysql->open_connection($IP_ADDR, $USER_DB, $PASSW_DB, $NAME_DB);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    }  

    // rebuild backup ecrypted with old password
    // get backup files
    $file_path = "../data/" . generate_hash($username) . "/*";
    $files = glob($file_path);
    foreach($files as $file){
        // read backup
        $data = json_decode(file_get_contents($file));

        $new_data = array();
        foreach($data as $item){
            $id = $item->id;
            $user = $item->user;
            $name = $item->name;
            $urlImage = $item->urlImage;
            $iv = $item->iv;
            $encrypted_body = $item->body;
    
            // decrypt body with old password e encrypt with the new one
            $decrypted_body = decrypt(hex2bin($iv), hex2bin($encrypted_body), $old_passw);
            $iv = generate_iv();
            $encrypted_body = encrypt($iv, $decrypted_body, generate_hash($new_passw));

            $item = [
                "id" => $id,
                "user" =>$user,
                "name" => $name,
                "urlImage" => $urlImage,
                "iv" => bin2hex($iv),
                "body" => bin2hex($encrypted_body),
            ];
            array_push($new_data, $item);
        }

        unlink($file);
        file_put_contents($file, json_encode($new_data));
    }
       
    // get all items of the user from database
    $items = $mysql->get_items($username);
    if($res == null){
        $response = [
            "status" => "ERROR",
            "msg" => -4
        ];
        echo json_encode($response);
        return;
    }
    
    foreach($items as $item){
    
        // encrypt item with the new passoword
        $id = $item['id'];
        $encrypted_body = hex2bin($item['body']);
        $iv = hex2bin($item['iv']);
        $body = decrypt($iv, $encrypted_body, $old_passw);
        $iv = generate_iv();
        $encrypted_body = encrypt($iv, $body, generate_hash($new_passw));

        //update the item
        $item['iv'] = bin2hex($iv);
        $item['body'] = bin2hex($encrypted_body);
        $item['user'] = $username;
        $res = $mysql->update_item($item);
        if(!$res){
            $response = [
                "status" => "ERROR",
                "msg" => -5
            ];
            echo json_encode($response);
            return;
        } 
        
    }

    //update password on user table
    $user = [
        'username' => $username,
        'password' => generate_hash_with_salt($new_passw)
    ];
    $res = $mysql->update_user($user);
    if(!$res){
        $response = [
            "status" => "ERROR",
            "msg" => -3
        ];
        echo json_encode($response);
        return;
    } 

    $response = [
        "status" => "SUCCESS"
    ];
    echo json_encode($response);

    $mysql->close_connection();
?>