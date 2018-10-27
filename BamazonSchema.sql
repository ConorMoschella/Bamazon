DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE stock(
  id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(100) NOT NULL,
  category VARCHAR(45) NOT NULL,
  item_discription VARCHAR(90) default NULL,
  inventory INT default 0,  
  price INT default 0,
  PRIMARY KEY (id)
);
