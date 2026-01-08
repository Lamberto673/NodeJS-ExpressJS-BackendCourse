import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
    const {name, email, password} = req.body;

    const userExists = await prisma.user.findUnique({
        where: {email: email},
    });

    if(userExists){
        return res.status(400).json({error : "User already exists"});
    }
    // Hash Passowrd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creae User
    const user = await prisma.user.create({
        data : {
            name, 
            email,
            password: hashedPassword,
        },
    });
    //Generate JWT token
    const token = generateToken(user.id, res);
    res.status(201).json({
        status: "success",
        data: {
            user : {
                id: user.id, 
                name: user.name, 
                email: user.email},
        },
        token,
    });
};


const login = async (req, res) => {
    const {email, password} = req.body;

    // Check if user email exists
    const user = await prisma.user.findUnique({
        where: { email: email },
    });
    if(!user){
        return res.status(401).json({ error: "Invalid Email or Password" });
    }

    // verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({ error: "Invalid Email or Password" });
    }

    // Generate JWT token
    const token = generateToken(user.id, res);

    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
        },
        token,
    });
}

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({
        status: "success",
        message: "Logged out succesfully",
    });
}



export {register , login, logout};