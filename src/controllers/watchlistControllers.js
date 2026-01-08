
import { prisma } from "../config/db.js";
const addToWatchList = async ( req, res) => {
    console.log("req.body:", req.body);
    console.log("req.headers:", req.headers);
    
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Request body is empty. Ensure Content-Type is application/json and body is valid JSON" });
    }
    const {movieId, status, rating, notes} = req.body;

    if (!movieId) {
        return res.status(400).json({ error: "movieId is required" });
    }

    // verify movie exists
    const movie = await prisma.movie.findUnique({
        where: {id: movieId},
    });

    if(!movie){
        return res.status(404).json({error: "Movie not found"});
    }

    // check if already added (use findFirst if no compound unique exists)
    const existingInWatchlist = await prisma.watchListItem.findFirst({
        where: {
            userId: req.user.id,
            movieId: movieId,
        },
    });
    if(existingInWatchlist){
        return res.status(400).json({error: "Movie already exists in watchlist"});
    }
    const watchlistitem = await prisma.watchListItem.create({
        data:{
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating, 
            notes,
        },
    });
    res.status(201).json({
        status: "Success",
        data:{
            watchlistitem,
        }
    })
};

const updateWatchList = async () => {
    const {status, rating, notes} = req.body;
    const watchListItem = await prisma.watchListItem.findUnique({
        where: {id: req.params.id},
    });
    if(!watchListItem){
        return res.status(404).json({error: "Watchlist is not found"});
    }

    //ensure only owner can delete
    if(watchListItem.userId !== req.user.id){
        return res
                .status(403)
                .json({error : "Not allowed to update to watchlist item"})
    }
    // Build Update Data
    const updateData = {};
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (rating !== undefined) updateData.rating = rating;
    if (notes !== undefined) updateData.notes = notes;
    await prisma.watchListItem.update({
        where : {id: req.params.id},
        data : updateData,
    })
    res.status(200).json({
        status : "Success",
        data : {
            watchListItem: updateItem,
        }
    })
};
const removeFromWatchList = async (req, res) => {
    const watchListItem = await prisma.watchListItem.findUnique({
        where: {id: req.params.id}
    })
    if(!watchListItem){
        return res.status(404).json({error: "Watchlist item not found"});
    }

    // Ensure only owner can delete
    if(watchListItem.userId !== req.user.id){
        return res.status(403).json({error : "Not allowed to update this watchlist item"})
    }

    await prisma.watchListItem.delete({
        where: {id:req.params.id}
    });

    res.status(200).json({
        status: "success",
        message: "movie removed from watchlist",
    });
}

export {addToWatchList, updateWatchList, removeFromWatchList};