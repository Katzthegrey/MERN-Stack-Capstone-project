import express from 'express';
import {
    createReservation,
    getReservationsByHost,
    getReservationsByUser,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    completeReservation,
    cancelReservation,
    getAllReservations,
    rateReservation       
} from '../controllers/reservationController.js';
import auth from '../middleware/auth.js';

const reservationRouter = express.Router();

reservationRouter.post('/', auth, createReservation);
reservationRouter.get('/host', auth, getReservationsByHost);
reservationRouter.get('/user', auth, getReservationsByUser);
reservationRouter.get('/all', auth, getAllReservations);
reservationRouter.get('/:id', auth, getReservationById);
reservationRouter.patch('/:id/status', auth, updateReservationStatus);
reservationRouter.patch('/:id/complete', auth, completeReservation);
reservationRouter.patch('/:id/cancel', auth, cancelReservation);
reservationRouter.delete('/:id', auth, deleteReservation);
reservationRouter.patch('/:id/rate', auth, rateReservation);

export default reservationRouter;