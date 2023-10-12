import asyncHandler from "express-async-handler";
import Movie from "../models/MovieModel.js";


//get movies
const getMovies = asyncHandler(async (req, res) => {
    try {
        // filter movies by category, time, rate, language, search and year
        const { category, time, rate, language, year, search } = req.query;
        let query = {
            ...(category && { category }),
            ...(time && { time }),
            ...(language && { language }),
            ...(rate && { rate }),
            ...(year && { year }),
            ...(search && { name: { $regex: search, $option: "i" } })
        }

        //load more movies functionality
        const page = Number(req.query.pageNumber) || 1; //if page number is not provided then it set to be 1
        const limit = 2; // 2 movies /page
        const skip = (page - 1) * limit; // skip 2 movies/ page

        //find movies by query, skip and limit
        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        //get total number of movies
        const count = await Movie.countDocuments(query);

        //send response with movies and total number of movies
        res.json({
            movies,
            page,
            pages: Math.ceil(count / limit), // total number of pages
            totalMovies: count, // total movies count
        })

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


//****************** Private Controllers ***********************


// get movie by id 
const getMovieById = asyncHandler(async (req, res) => {
    try {
        // find movie
        const movie = Movie.findById(req.params.id);
        // check if movie is find then send it to client
        if (movie) {
            res.json(movie);
        } else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//get top rated movies
const getTopRatedMovies = asyncHandler(async (req, res) => {
    try {
        // find top rated movies
        const movies = await Movie.find({}).sort({ rate: -1 });
        // send top rated movies to client
        res.json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
 

//get random movies
const getRandomMovies = asyncHandler(async (req, res) => {
    try {
        // get random movies
        const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
        // send random movies to client
        res.json(movies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//create movie review
const createMovieReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    try {
        // find movie by id in database
        const movie = await Movie.findById(req.params.id);

        // check if movie exist then add review in it
        if (movie) {
            // chcek if the user alreday reviewed the movie
            const alreadyReviewed = movie.reviews.find(
                (r) => r.userId.toString() == req.user._id.toString()
            );

            // create new review
            const review = {
                userName: req.user.fullName,
                userId: req.user._id,
                userImage: req.user.image,
                rating: Number(rating),
                comment,
            }

            // push new review into the reviews array
            movie.reviews.push(review);
            // increment the number of reviews
            movie.numofReviews = movie.reviews.length;

            // calculate the new rate
            movie.rate = movie.reviews.reduce((acc, item) => item.rating + acc, 0) / movie.reviews.length;

            await movie.save();

            //send the new movie to the client
            res.status(201).json({
                message: "Review added",               
            })
        }
        else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ***************** Admin **********************

// update a movie
const updateMovie = asyncHandler(async (req, res) => {
    try {
        // get data from request body
        const {
            name,
            desc,
            image,
            titleImage,
            rate,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts
        } = req.body;
        // get movie by id
        const movie = await Movie.findById(req.params.id);
        // if movie exist then update the movie
        if (movie) {
            movie.name = name || movie.name;
            movie.desc = desc || movie.desc;
            movie.image = image || movie.image;
            movie.titleImage = titleImage || movie.titleImage;
            movie.category = category || movie.category;
            movie.rate = rate || movie.rate;
            movie.numOfReviews = numOfReviews || movie.numOfReviews;
            movie.time = time || movie.time;
            movie.language = language || movie.language;
            movie.year = year || movie.year;
            movie.video = video || movie.video;
            movie.casts = casts || movie.casts;

            //save movie in database
            const updateMovie = await movie.save();

            res.status(201).json(updateMovie);
        } else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete a movie
const deleteMovie = asyncHandler(async (req, res) => {
    try {
        // find movie in the database
        const movie = await Movie.findById(req.params.id);
        // if movie found then delete it
        if (movie) {
            await movie.remove();
            res.json({ message: "Movie Removed from database" });
        }
        else {
            res.status(404);
            throw new Error("Movie not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//delete all movies
const deleteAllMovie = asyncHandler(async (req, res) => {
    try {
        const deleteAll = await Movie.delete({});
        res.json({ message: "All movies deleted" })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//create new movie
const createMovie = asyncHandler(async (req, res) => {
    try {
        // get data from request body
        const {
            name,
            desc,
            image,
            titleImage,
            rate,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts
        } = req.body;
         
        // create a new movie 
        const movie = new Movie({
            name,
            desc,
            image,
            titleImage,
            rate,
            category,
            numOfReviews,
            time,
            language,
            year,
            video,
            casts,
        
            userId: req.user._id
        })
        
        // if movie created then save it in database
        if (movie) {
            await movie.save();
            res.json(movie);
        }
        else {
            res.status(404);
            throw new Error("Invalid Movie data");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export {
    getMovies,
    getMovieById,
    getTopRatedMovies,
    getRandomMovies,
    deleteMovie,
    deleteAllMovie,
    createMovie,
    updateMovie,
    createMovieReview
}