<?php

$IP_ADDR = '172.20.0.11';
$USER_DB = 'root';
$PASSW_DB = 'password';
$NAME_DB = 'zifiorino_db';

class MySql {

    private $conn;

    public function __constructor(){
        $conn = null;
    }
    
    public function open_connection($ip_addr, $user_db, $passw_db, $name_db){
        
        $conn = mysqli_connect($IP_ADDR, $USER_DB, $PASSW_DB);
        if(!$conn)
            return false;

        $sql = "USE " . $NAME_DB . ";";
        if(!$conn->query($sql)){
            $conn->close();
            return false;
        }
        
        return true;
    }

    public function close_connection(){
        $conn->close();
        $conn = null;
    }

    // ------------- GET -----------------
    public function get_user($username){

        if($conn == null)
            return null;
        
        $sql = "SELECT* FROM USER WHERE user LIKE BINARY ?";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return null;

        $stmt->bind_param("s", $username);
        if(!$stmt) return null;

        $stmt->execute();
        if(!$stmt) return null;

        $result = $stmt->get_result();

        if($result->num_rows == 0)
            return null;
        else{
            $user = [
                "username" => $row['user'],
                "password" => $row['passw']
            ];
            return $user;
        }
    }

    public function get_item($id, $username){

        if($conn == null)
            return null;

        $sql = "SELECT* FROM ITEM WHERE id LIKE BINARY ? AND user LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return null;

        $stmt->bind_param("is", $id, $username);
        if(!$stmt) return null;

        $stmt->execute();
        if(!$stmt) return null;

        $result = $stmt->get_result();

        if($result->num_rows > 0)
            while($row = $result->fetch_assoc()){

                $name = $row['name'];
                $urlImage = $row['urlImage'];
                $iv = $row['iv'];
                $body = $row['body'];
                
                $item = [
                    'id' => $id,
                    'user' => $username,
                    'name' => $name,
                    'urlImage' => $urlImage,
                    'iv' => $iv,
                    'body' => $body
                ];

                return $item;
            }
    }

    public function get_items($username){

        if($conn == null)
            return null;

        $sql = "SELECT* FROM ITEM WHERE user LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return null;

        $stmt->bind_param("s", $username);
        if(!$stmt) return null;

        $stmt->execute();
        if(!$stmt) return null;
        
        $result = $stmt->get_result();
        $items = array();
        if($result->num_rows > 0)
            while($row = $result->fetch_assoc()){
                $id = $row['id'];
                $name = $row['name'];
                $urlImage = $row['urlImage'];
                $iv = $row['iv'];
                $body = $row['body'];
                
                $item = [
                    'id' => $id,
                    'user' => $username,
                    'name' => $name,
                    'urlImage' => $urlImage,
                    'iv' => $iv,
                    'body' => $body
                ];

                array_push($items, $item);
            }
        
        return $items;
    }

    // -------------- CREATE ------------------
    public function create_user($user){

        if($conn == null)
            return false;

        $sql="INSERT INTO USER VALUES(?, ?)";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return false;
        
        $stmt->bind_param("ss", $user->username, $user->password);
        if(!$stmt) return false;
        
        $stmt->execute();
        if(!$stmt) return false;

        return true;
    }

    public function create_item($item){

        if($conn == null)
            return -1;
        
        $sql = "INSERT INTO ITEM VALUES(?, ?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return -1;

        $stmt->bind_param("isssss", $item->id, $item->user, $item->name, $item->$urlImage, $item->iv, $item->body);
        if(!$stmt) return -1;

        $stmt->execute();
        if(!$stmt) return -1;

        //get the id assigned to the item
        $sql = "SELECT id from ITEM WHERE user LIKE BINARY ? ORDER BY id DESC LIMIT 1;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return -1;

        $stmt->bind_param("s", $username);
        if(!$stmt) return -1;

        $stmt->execute();
        if(!$stmt) return -1;

        $result = $stmt->get_result();
        if($result->num_rows <= 0)
            return -1;

        while($row = $result->fetch_assoc()){
            $id = $row['id'];
            return $id;
        }
    }

    // -------------- UPDATE -----------------


    public function update_user($user){

        if($conn == null)
            return false;

        $sql="UPDATE USER SET passw = ? WHERE user LIKE BINARY ?";
        $stmt=$conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("ss", $user->password, $user->username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;
    }

    public function update_item($item){
        
        if($conn == null)
            return false;

        $sql="UPDATE ITEM SET name = ?, urlImage = ?, iv = ?, body = ? WHERE id LIKE BINARY ? AND user LIKE BINARY ?";
        $stmt=$conn->prepare($sql);
        if(!$stmt) return false;
        
        $stmt->bind_param("ssssis", $item->name, $item->urlImage, $item->iv, $item->body, $item->$id, $item->user);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        return true;
    }

    // -------------- DELETE -----------------

    public function remove_item($id, $username){

        if($conn == null)
            return false;

        //remove the item
        $sql = "DELETE FROM ITEM WHERE id LIKE BINARY ? AND user LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("is", $id, $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //check if the item exists
        $sql = "SELECT * from ITEM WHERE id LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("i", $id);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        $result = $stmt->get_result();

        if($result->num_rows > 0)
            return false;
        
        return true;

    }

    public function remove_all_item($username){

        if($conn == null)
            return false;

        // remove all item of the user
        $sql = "DELETE FROM ITEM WHERE user LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //check if the item exists
        $sql = "SELECT * from ITEM WHERE user LIKE BINARY ?;";
        $stmt = $conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        $result = $stmt->get_result();
        if($result->num_rows > 0)
            return false;
        
        return true;
    }


}


?>