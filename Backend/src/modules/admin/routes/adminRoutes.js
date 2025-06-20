import express from 'express'
import tryCatch from '../../utils/tryCatch.js'
import { addEvents, deleteEvent, editEvent, getEvents } from '../controllers/EventController/EventController.js'
import { BlockAndUnblock, deleteUser, getUsers } from '../controllers/UserController/UserController.js'
import { allBooking } from '../controllers/BookingController/BookingController.js'
import { deleteReview } from '../controllers/ReviewController/ReviewController.js'
import uploadEventImage from '../../utils/multerEvent.js'

const adminRouter=express.Router()
// events add , edit , delete, getAll
adminRouter.post('/addEvents',uploadEventImage.single('eventImage'),tryCatch(addEvents))
adminRouter.patch('/editEvent/:eventId',uploadEventImage.single('eventImage'),tryCatch(editEvent))
adminRouter.delete('/deleteEvent',tryCatch(deleteEvent))
adminRouter.get('/getEvents',tryCatch(getEvents))
// all bookings 
adminRouter.get('/allBookings',tryCatch(allBooking))

// getUser , BlockAndUnblock & deleteUser
adminRouter.get('/getUsers',tryCatch(getUsers))
adminRouter.delete('/BlockAndUnblock',tryCatch(BlockAndUnblock))
adminRouter.delete('/deleteUser',tryCatch(deleteUser))

// reviewDelete
adminRouter.delete('/deleteReview',tryCatch(deleteReview))


export default adminRouter