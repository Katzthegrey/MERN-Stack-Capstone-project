import express from "express";
import {
    createAccommodation,
    getAccommodations,
    getAccommodationById,
    updateAccommodation,
    deleteAccommodation,
} from '../controllers/accommodationController.js';
import upload from "../middleware/multer.js";
import auth, { hostAuth } from "../middleware/auth.js";

const accommodationRouter = express.Router();

// Create accommodation (POST) 
accommodationRouter.post(
    '/',
    auth,
    hostAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
    ]),
    createAccommodation
);

// Read all accommodations (GET) 
accommodationRouter.get('/', getAccommodations);

// Read single accommodation (GET) 
accommodationRouter.get('/:id', getAccommodationById);

// Update accommodation (PUT) 
accommodationRouter.put(
    '/:id',
    auth,
    hostAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 },
        { name: 'image5', maxCount: 1 },
    ]),
    updateAccommodation
);

// Delete accommodation (DELETE) 
accommodationRouter.delete('/:id', auth, hostAuth, deleteAccommodation);

export default accommodationRouter;