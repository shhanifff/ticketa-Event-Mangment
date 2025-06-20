import express from 'express'
import { changeName, generatetOTP, handleGoogleAuth, loginHandler, userProfileImage, userRegister, verifyOTP } from '../controllers/userController/userController.js'
import  tryCatch  from '../../utils/tryCatch.js'
import { addReview, getReviws } from '../controllers/userController/reviewController.js'
import { handleBooking, qrDetails } from '../controllers/BookingController/BookingController.js'
import { getProfile } from '../controllers/profileController/profileController.js'
import { createBooking, getKey, verifyBookingPayment } from '../controllers/paymentController/paymentController.js'
// import upload from '../../utils/multer.js'
import uploadProfile from '../../utils/multerProfile.js'
const userRouter = express.Router()

// user login , register, google auth
userRouter.post('/register',tryCatch(userRegister))
userRouter.post('/login',tryCatch(loginHandler))
userRouter.post('/auth',handleGoogleAuth)
userRouter.put('/changeName/:userId',tryCatch(changeName))
userRouter.post('/profileImageUpload/:userId', uploadProfile.single('profileImage'), userProfileImage);

// genrate otp
userRouter.post('/generate-otp',tryCatch(generatetOTP))
// verify otp
userRouter.post('/verify-otp',tryCatch(verifyOTP))

// review , allreview
userRouter.post('/addreview',tryCatch(addReview))
userRouter.get('/allreview',tryCatch(getReviws))

// booking
userRouter.post('/booking',tryCatch(handleBooking))
// qr code Details 
userRouter.post('/qrCode-details',tryCatch(qrDetails)) 
// userProfile
userRouter.get('/profile/:userId',tryCatch(getProfile))
// creat booking
userRouter.post('/payment/:userId',createBooking)
// getKey 
userRouter.get('/getKey',getKey)
// verifyBookingPayment
userRouter.post('/verify-payment/:userId',tryCatch(verifyBookingPayment))

export default userRouter