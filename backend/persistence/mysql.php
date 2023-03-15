<?php

class MySql {

    private $conn;

    public function __constructor(){
        $this->conn = null;
    }
    
    public function open_connection($ip_addr, $user_db, $passw_db, $name_db){
        
        $this->conn = mysqli_connect($ip_addr, $user_db, $passw_db);
        if(!$this->conn)
            return false;

        $sql = "USE " . $name_db . ";";
        if(!$this->conn->query($sql)){
            $this->conn->close();
            return false;
        }
        
        return true;
    }

    public function close_connection(){
        $this->conn->close();
        $this->conn = null;
    }

    // ------------- GET -----------------
    public function get_user($username){

        if($this->conn == null)
            return null;
        
        $sql = "SELECT* FROM USER WHERE user LIKE BINARY ?";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return null;

        $stmt->bind_param("s", $username);
        if(!$stmt) return null;

        $stmt->execute();
        if(!$stmt) return null;

        $result = $stmt->get_result();

        if($result->num_rows == 0)
            return null;
        else{
            if($result->num_rows > 0)
                while($row = $result->fetch_assoc()){
                    $user = [
                        "username" => $row['user'],
                        "password" => $row['passw']
                    ];
                    return $user;
                }
        }
    }

    public function get_item($id, $username){

        if($this->conn == null)
            return null;

        $sql = "SELECT * FROM ITEM WHERE id LIKE BINARY ? AND user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
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

        return null;
    }

    public function get_items($username){

        if($this->conn == null)
            return null;

        $sql = "SELECT* FROM ITEM WHERE user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
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

        if($this->conn == null)
            return false;

        $sql="INSERT INTO USER VALUES(?, ?)";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;
        
        $stmt->bind_param("ss", $user['username'], $user['password']);
        if(!$stmt) return false;
        
        $stmt->execute();
        if(!$stmt) return false;

        return true;
    }

    public function create_item(&$item){

        if($this->conn == null)
            return false;
        
        $sql = "INSERT INTO ITEM VALUES(?, ?, ?, ?, ?, ?);";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("isssss", $item['id'], $item['user'], $item['name'], $item['urlImage'], $item['iv'], $item['body']);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //get the id assigned to the item
        $sql = "SELECT * from ITEM WHERE user LIKE BINARY ? ORDER BY id DESC LIMIT 1;";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $item['user']);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        $result = $stmt->get_result();
        if($result->num_rows <= 0){
            return false;
        }

        while($row = $result->fetch_assoc()){
            $item['id'] = $row['id'];
            return true;
        }
    }

    // -------------- UPDATE -----------------

    public function update_user($user){

        if($this->conn == null)
            return false;

        $sql="UPDATE USER SET passw = ? WHERE user LIKE BINARY ?";
        $stmt=$this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("ss", $user['password'], $user['username']);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        return true;
    }

    public function update_item($item){
        
        if($this->conn == null)
            return false;

        $sql="UPDATE ITEM SET name = ?, urlImage = ?, iv = ?, body = ? WHERE id LIKE BINARY ? AND user LIKE BINARY ?";
        $stmt=$this->conn->prepare($sql);
        if(!$stmt) return false;
        
        $stmt->bind_param("ssssis", $item['name'], $item['urlImage'], $item['iv'], $item['body'], $item['id'], $item['user']);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        return true;
    }

    // -------------- DELETE -----------------

    public function delete_item($id, $username){

        if($this->conn == null)
            return false;

        //remove the item
        $sql = "DELETE FROM ITEM WHERE id LIKE BINARY ? AND user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("is", $id, $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //check if the item exists
        $sql = "SELECT * from ITEM WHERE id LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
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

    public function delete_all_items($username){

        if($this->conn == null)
            return false;

        // remove all item of the user
        $sql = "DELETE FROM ITEM WHERE user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //check if the item exists
        $sql = "SELECT * from ITEM WHERE user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
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

    public function delete_user($username){

        if($this->conn == null)
            return false;

        //remove the user
        $sql = "DELETE FROM USER WHERE user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $username);
        if(!$stmt) return false;

        $stmt->execute();
        if(!$stmt) return false;

        //check if the user exists
        $sql = "SELECT * from USER WHERE user LIKE BINARY ?;";
        $stmt = $this->conn->prepare($sql);
        if(!$stmt) return false;

        $stmt->bind_param("s", $user);
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