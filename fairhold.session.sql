
CREATE TABLE socialRentAdjustments (
  id int NOT NULL AUTO_INCREMENT,
  year varchar(50) DEFAULT NULL,
  inflation float DEFAULT NULL,
  additional float DEFAULT NULL,
  total float DEFAULT NULL,
  PRIMARY KEY (`id`)
) 
