import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please enter your full name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter the password"],
        minlength: [8, "Password must be atleast 8 characters"],
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            
        }
    ]
}, {
    timestamps: true,
});

export default mongoose.model("User", UserSchema);