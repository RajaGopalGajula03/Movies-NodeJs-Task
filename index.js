

const express = require('express');
const path = require('path');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const app = express();
const port = 4446;
const dbPath = path.join(__dirname,"moviesData.db");

app.use(express.json())

let db = null;

const initializeDBAndServer = async()=>{
    try{
        db = await open({
            filename: dbPath,
            driver:sqlite3.Database,
        })
        app.listen(port,(req,res)=>{
            console.log(`DB started \nserver running at ${port}`)
        })
    }
    catch(error)
    {
        console.log(`Internal error ${error.message}`);
        process.exit(1);
    }
}

initializeDBAndServer();

// get all movies api

app.get("/movies",async(req,res)=>{
    try{
        const getMovieQuery = `SELECT * FROM movieData order by movie_id`;
        const movieArray = await db.all(getMovieQuery);
        return res.status(200).send(movieArray);
    }
    catch(error)
    {
        console.log("movies",error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// add movie to database

app.post("/add-movie",async(req,res)=>{
    const{directorId,movieName,leadActor} = req.body;
    try{
        const addMovieQuery = `INSERT INTO movieData(director_id,movie_name,lead_actor )
        VALUES
        (
        ${directorId},
        '${movieName}',
        '${leadActor}'
        );`;
        const movie = await db.run(addMovieQuery);
        const lastId = movie.lastID;
        return res.status(200).send(`Movies Added Successfully with Movie Id ${lastId}`)
    }
    catch(error)
    {
        console.log("add-movie",error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// get movie based on id

app.get("/movies/:movieId",async(req,res)=>{
    const {movieId} = req.params;
    try{
        const getMovieQuery = `SELECT * FROM movieData where movie_id = ${movieId};`;
        const movie = await db.get(getMovieQuery);
        return res.status(200).send(movie);
    }
    catch(err)
    {
        console.log("movies/movieId",err.message);
        return res.status(500).send("Internal Server Error");
    }
})

// update movie data
app.put("/update-movie/:movieId",async(req,res)=>{
    const {movieId} = req.params;
    const{directorId,movieName,leadActor} = req.body;
    try{
        const updateMovieQuery = `update movieData set director_id = ${directorId},movie_name = '${movieName}',lead_actor = '${leadActor}' where movie_id = ${movieId};`;
        await db.run(updateMovieQuery);
        return res.status(200).send(`movie Details Updated With Id ${movieId}`);
    }
    catch(err)
    {
        console.log("update-movie",err.message);
        return res.status(500).send("Internal Server Error");
    }
})

// delete specific movie
app.delete("/delete-movie/:movieId",async(req,res)=>{
    const{movieId} = req.params;
    try{
        const deleteMovieQuery = `DELETE FROM movieData where movie_id = ${movieId};`;
        await db.run(deleteMovieQuery);
        return res.status(200).send(`Movie Deleted Successfully with id ${movieId}`);
    }
    catch(err)
    {
        console.log("delete-movie",err.message);
        res.status(500).send("Internal Server Error");
    }
})

// get all directors

app.get("/directors",async(req,res)=>{
    try{
        const getDirectorsQuery = `SELECT * FROM director order by director_id`;
        const directorArray = await db.all(getDirectorsQuery);
        return res.status(200).send(directorArray);
    }
    catch(error)
    {
        console.log("directors",error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// get list of movies directed by specifis director

app.get("/directors/:directorId/movies",async(req,res)=>{
    const {directorId} = req.params;
    try{
        const directorMovieQuery = `SELECT movie_name from movieData where director_id = ${directorId} ORDER BY movie_id;`;        
        const movieArray = await db.all(directorMovieQuery);
        return res.status(200).send(movieArray);
    }
    catch(err)
    {
        console.log("directors/:directorId/movies",err.message);
        res.status(500).send("Internal Server Error");
    }
})