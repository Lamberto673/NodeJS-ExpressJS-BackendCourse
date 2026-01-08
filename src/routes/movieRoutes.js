import express from "express"
import { register } from "../controllers/authControllers.js";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({message : "Hello"})
})

router.get("/hello", (req, res) => {
    res.json({message : "Hello again"})
})

export default router;