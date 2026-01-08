import express from "express"
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";
//Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";


config();
connectDB();

const app = express();

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// API routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);


// const PORT = process.env.PORT || 3000;

const server = app.listen(process.env.PORT || 5001, "0.0.0.0", () => {
    console.log(`The server is listening at ${PORT}`);
})

//HANDLE UNDHANDLED PROMISE REJECTIONS  (e.g., DATABASE CONNECTION ERRORS)
process.on("unhandledRejection", (err)=>{
    console.error("unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

//HANDLE UNCAUGHT EXCEPTION
process.on("UncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

//GRACEFUL SHUTDOWN
process.on("SIGTERM", async() => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async() =>{
        await disconnectDB();
        process.exit(0);
    });
});

// const users = [
// {username : "Donny", age : 110}
// ]

// app.get("/", (req, res) => {
//     res.json({message : "Hello World"});
// })
// app.get("/api/users", (req, res) => {
//     res.send(users);
// })
// app.post("/api/users/", (req, res) => {
//     const newUsers = {
//         id: users.length+1,
//         username: req.body.username,
//         age: req.body.age
//     }
//     users.push(newUsers);
//     res.status(201).send(newUsers);
// })
