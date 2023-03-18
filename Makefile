DB_IMAGE = zf-mysql
SERVER_IMAGE = zf-apache-php
DB_DOCKERFILE = db_dockerfile
SERVER_DOCKERFILE = server_dockerfile

build:
	docker build -f ${DB_DOCKERFILE} -t ${DB_IMAGE} .
	docker build -f ${SERVER_DOCKERFILE} -t ${SERVER_IMAGE} .

run:
	docker network create --driver bridge --subnet 172.20.0.0/16 zf-net
	docker run -d --name ${DB_IMAGE} --net zf-net --ip 172.20.0.11 -p 3306:3306 ${DB_IMAGE}
	docker run -d --name ${SERVER_IMAGE} --net zf-net --ip 172.20.0.10 -p 80:80 ${SERVER_IMAGE}

clean:
	docker stop ${DB_IMAGE} ${SERVER_IMAGE}
	docker rm ${DB_IMAGE} ${SERVER_IMAGE}
	docker network rm zf-net
