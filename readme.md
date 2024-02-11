# Initail Setup:

echo "# youtube-clone-backend-project" >> README.md
git init  
git add README.md  
git commit -m "first commit"  
git branch -M main  
git remote add origin git@github.com:FREAKIN-D1A/youtube-clone-backend-project.git  
git push -u origin main

# Workflow:

first create public/temp/.gitkeep

inside src create server.js app.js constants.js

inside src mkdir controllers db middlewares models routes utils

##### .env with dotenv:

inside server.js >  
import dotenv from "dotenv";  
dotenv.config({ path: "./.env" });

inside .env >  
 "scripts": {  
 "dev": "nodemon -r dotenv/config --experimental-json-modules --experimental-specifier-resolution=node src/server.js"
},

##### connectDB:

inside src/db/index.js >
create connectDB function which will use a try catch method to establish connection with the mongodb
database. the function will be an async one. It will use mongoose.connect()  
const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);  
you can console log connectionInstance.connection.host to show the connection instance host.

inside server.js >
import connectDB from "./db/index.js";  
connectDB()

since connectDB() is an async function, the function will be returning a promise as well.  
So, we can use a .then() method and a .catch() method for this connectDB()

##### Setting Up app.js:

import express , cors, cookieParser  
declare app  
write error handling,

we will use req.params , req.body, req.cookies mostly  
most middlewares hass app.use syntax  
use cors, json, urlencoded,static, cookieParser  
export to server.js

##### Setting Up asyncHandler.js:

instead of writing async await each and everytime,  
we use a separate async handler function

##### Setting Up apiError.js:

To have all the error in one coherent syntax

##### Setting Up apiResponse.js:

    class ApiResponse {
    constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    }
    }

    export { ApiResponse };

### Create Models:

#### Create video.model.js:

    videoFile
    thumbnail
    title
    description
    duration
    views
    ifPublished
    owner: {
    type: Schema.Types.ObjectId, // cloud
    ref: "User",
    },

    videoSchema.plugin(mongooseAggregatePaginate);

this allows us to use aggregation queries.

#### Create user.model.js:

    username
    email
    fullName
    avatar
    coverImage
    watchHistory: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    password: { type: String, required: [true, "Password is required"] },
    refreshToken: { type: String },

We are not storing accessToken here.

<!-- userSchema.pre hooks works right before it saves the schema -->

    userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
    });

<!--
this syntax adds custom methods to the schema
 -->

    userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    }; <!-- this will be used in the controllers.-->

write userSchema.methods.generateAccessToken with jwt.sign({user payload},token_secret, token_expiry)
write userSchema.methods.generateRefreshToken the same way jwt.sign({ \_id: this.\_id,},token_secret, token_expiry)

#### using cloudinary for fileupload : src/utils/clouninary.js:

    import { v2 as cloudinary } from "cloudinary";
    import fs from "fs";

    cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadOnCloudinary = async (localFilePath) => {
    try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto",
    });

        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
    fs.unlinkSync(localFilePath);
    // remove the locally saved temporary file as the upload operation got failed
    return null;
    }
    };

    export { uploadOnCloudinary };

#### using multer for fileupload : src/middlewares/multer.middleware.js:

we will write a middleware.

    import multer from "multer";
    const { v4: uuidv4 } = require("uuid");
    const path = require("path");

    const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
    const uniqueName = uuidv4().toString() + path.extname(file.originalname);
    cb(null, uniqueName);
    // cb(null, file.originalname);
    },
    });

    export const upload = multer({
    storage,
    });

### Setup Done. the next part starts here.:
