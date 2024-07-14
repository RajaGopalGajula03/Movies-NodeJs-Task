CREATE TABLE director(director_id INTEGER PRIMARY KEY,director_name TEXT);

CREATE TABLE movieData(movie_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
director_id INTEGER,
movie_name TEXT,
lead_actor TEXT, 
FOREIGN KEY (director_id) 
REFERENCES director(director_id) ON DELETE SET NULL);

PRAGMA TABLE_INFO(director);
PRAGMA TABLE_INFO(movieData);

SELECT * FROM movieData;

INSERT INTO director(director_id,director_name)
VALUES(1,'Trivikram Srinivas'),
(2,'Raja Mouli'),(3,'Sukumar'),
(4,'Nag Aswin'),(5,'Prasanth Varma'),
(6,'Buchhi Babu'),(7,'Samuthirakani')

SELECT * FROM director;
