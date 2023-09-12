<p align="center">
  <img loading='lazy' src="frontend/public/logo.png" alt="ZiFiorino-Logo" height="64px"/>
</p>

# ZiFiorino

ZiFiorino is a web app implemented with React JS. The goal is to have a convenient and secure user friendly app in which to store your passwords without relying on third-party services. 
To delvelop ZiFiorino it's used two container, one for a Apache server and one for MySql.

It's possible to try it at the link https://zifiorino.altervista.org.

## How to install

### Prerequisites
- Linux System or Windows WSL
- Docker

### Rapid Method
- Download the zip of the repository
- Unzip the file and open a terminal inside
- Execute
```
make build
make run
```
- Open a browser and go to localhost 

If you want remove ZiFiorino, you can execute
```
make clean
```

### Manual Method
- Create a docker network
```
docker network create --driver bridge --subnet 172.20.0.0/16 zf-net
```
- Install Apache container
```
docker run -d --name zf-apache-php --net zf-net --ip 172.20.0.10 -p 80:80 php:7.4-apache
```
- Run Apache container and enable mysqli
```
docker start zf-apache-php
```
```
docker exec -it zf-apache-php /bin/bash
```
```
# docker-php-ext-install mysqli
```
```
# docker-php-ext-enable mysqli
```
- Install MySql container
```
docker run --name zf-mysql --net zf-net --ip 172.20.0.11 -p 3306:3306 -v mysql_volume:/var/lib/mysql/ -d -e "MYSQL_ROOT_PASSWORD=password" mysql
```
- Download the release, this is the structure:
```
ZiFiorino-release
├── backend
├── frontend-build
└── db_builder.sql

```
- Copy the content of 'frontend-build' in '/var/www/html' of the Apache container
- Execute the 'db_builder.sql' script in the MySql container
- Copy the 'backend' folder in '/var/www/html' of the Apache container
-  Make sure that '$IP_ADDR' in the 'backend/config.php' file is the same of the MySql container
- Make sure that the ip addresse in the 'frontend-build/config.json' file is the same or your machine
- Open a browser and go to your machine ip address

## Problems
- The communication shoud be under HTTPS because the security of the communication is not guaranted
- If you don't want configure an HTTPS server with a SSL certificate you can adopt a VPN approach (for instance Wireguard)
- If you want access to ZiFiorino from the extern of your LAN network and you don't want expose your Apache server, you can use a VPN but you should have a static ip address for your machine. You can solve the static ip problem with the NoIp DNS service or similar.

## Notes about data security

### Authentication
The authentication is done at the login phase through username and password. The access password is stored in the MySql server in SHA 256 with salt, so if you forget the password you can't recover it. 
After the username and password verification, the server generates a JWT with following structure:
```
JWT = {
    "username": "username",
    "password": sha256("password"),
    "exp": expiration_time
}
```
The JWT is signed by the server and it's sent to the client, the client have to insert the JWT in any request to prove its identity. 

### Secure Storage
The SHA 256 without salt is used as the key to encrypt confidential data with the AES 256 algorithm, a different IV (initialization vector) is used for each element to be encrypted. In this way, all the confidential data in the database and backups are protected with symmetric encryption.

## Author
Gianluca Gemini, gianlucagemini98@gmail.com