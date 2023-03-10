create database if not exists zifiorino_db;
use zifiorino_db;

/*
 TABLE USER

    +----------+-------+
    | username | passw |
    +----------+-------+

*/

drop table if exists USER;
create table USER(
    user varchar(100) not null,
    passw varchar(500) not null,
    primary key(user)
)engine=InnoDB default charset=latin1;


/*
 TABLE ITEM

    +----+------+------+----------+------+
    | id | user | name | urlImage | item |
    +----+------+------+----------+------+

*/

drop table if exists ITEM;
create table ITEM(
    id int not null auto_increment,
    user varchar(100) not null,
    name varchar(100) not null,
    urlImage varchar(500) not null,
    item blob not null, 
    primary key(id)
)engine=InnoDB default charset=latin1;
