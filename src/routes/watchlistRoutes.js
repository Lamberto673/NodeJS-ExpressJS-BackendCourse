import express from  "express"
import {addToWatchList, updateWatchList, removeFromWatchList} from "../controllers/watchlistControllers.js"
import {authMiddleware} from "../middleware/authMiddleware.js"
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchListSchema } from "../validators/watchlistValidators.js";
const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware);

router.post("/", validateRequest(addToWatchListSchema) ,addToWatchList);

// {{baseURL}}/watchlist/:id
router.put("/:id", updateWatchList);
// {{baseURL}}/watchlist/:id
router.delete("/:id", removeFromWatchList);
// router.post("/login", login);

// router.post("/logout", logout);
export default router;