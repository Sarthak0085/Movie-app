import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/auth";

//register user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const isUserExist = User.findOne({ email });

        // if user exist
        if (isUserExist) {
            res.status(400);
            throw new Error("User Already Exist");
        }

        // hash password
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user in db
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            image,
        });

        // if user created then send user data and token to client
        if (user) {
            res.status(201).json({
                _id: user?._id,
                fullName: user?.fullName,
                email: user?.email,
                password: user?.password,
                image: user?.image,
                isAdmin: user?.isAdmin,
                token: generateToken(user?._id),
            });
        } else {
            res.status(400);
            throw new Error("Invalid User Data");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = User.findOne({ email });

        // if user exist
        if (isUserExist) {
            res.status(400);
            throw new Error("User Already Exist");
        }

        // if user created then send user data and token to client
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(201).json({
                _id: user?._id,
                fullName: user?.fullName,
                email: user?.email,
                password: user?.password,
                image: user?.image,
                isAdmin: user?.isAdmin,
                token: generateToken(user?._id),
            });
        }

        // if user email or password is not matched
        else {
            res.status(400);
            throw new Error("Invalid User credentials");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//updating user profile using private routes
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, image } = req.body;
    try {
        //find user in Db
        const user = User.findById(req.user._id);

        // if user exists updated user data and save data in db

        if (user) {
            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.image = image || user.image;

            const updatedUser = await user.save();
            //s
            res.status(201).json({
                _id: updatedUser?._id,
                fullName: updatedUser?.fullName,
                email: updatedUser?.email,
                password: updatedUser?.password,
                image: updatedUser?.image,
                isAdmin: updatedUser?.isAdmin,
                token: generateToken(updatedUser?._id),
            });
        } else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//deleteing user using private routes
const deleteUser = asyncHandler(async (req, res) => {
    try {
        //find user in Db
        const user = User.findById(req.user._id);

        // if user exists delete user from db

        if (user) {
            // if user is Admin then throw error
            if (isAdmin) {
                res.status(400);
                throw new Error("Can't delete Admin");
            }

            await User.remove();
            res.json({ message: "User deleted Successfully" });
        } else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// change user password
//deleteing user using private routes
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        //find user in Db
        const user = User.findById(req.user._id);

        // if user exists then compare its old password

        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            // hash new password
            const salt = await bcrypt.genSalt(15);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;

            await user.save();
            res.json({ message: "Password changed!!" });
        } else {
            res.status(404);
            throw new Error("Old password doesn't match");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//add or remove liked movie
const addOrRemoveLikedMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    try {
        // find user in db
        const user = await User.findById(req.user._id);
        // if user exists then add movies to liked movies and save it in db
        if (user) {
         // if movie already liked then remove it from liked movies
            if (user.likedMovies.includes(movieId)) {
                const index = likedMovies.indexOf(movieId);
                likedMovies.splice(index, 1);
                await user.save();
            }

            // else add movie to liked movies
            user.likedMovies.push(movieId);
            await user.save();

            res.json(user.likedMovies)
        }
        //else throw error
        else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// remove all liked movies using private route
const removeAllMovies = asyncHandler(async (req, res) => {
    try {
        // find user in db
        const user = await User.findById(req.user._id);
        // if user found then remove all its liked movies
        if (user) {
            user.likedMovies = [];
            await user.save();
            res.json({ message: "All liked movies deleted successfully" });
        }
        //else throw error
        else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ****************** Admin Controller ******************

//get all users 
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        //get all users
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const deleteUserByAdmin = asyncHandler(async (req, res) => {
    try {
        //find user in Db
        const user = User.findById(req.params.id);

        // if user exists delete user from db

        if (user) {
            // if user is Admin then throw error
            if (isAdmin) {
                res.status(400);
                throw new Error("Can't delete Admin");
            }

            await User.remove();
            res.json({ message: "User deleted Successfully" });
        } else {
            res.status(404);
            throw new Error("User Not Found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUser,
    changePassword,
    addOrRemoveLikedMovie,
    removeAllMovies,
    getAllUsers,
    deleteUserByAdmin
};
