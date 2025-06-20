import express from 'express'
import tryCatch from '../../utils/tryCatch.js'
import { addNotification, getNotification, markAsRead } from '../controllers/NotificationController/NotificationController.js'
const notificationRouter = express.Router()
// creat Notification 
notificationRouter.post('/addNotification',tryCatch(addNotification))
// get 
notificationRouter.get('/getNotification',tryCatch(getNotification))
// mark as read 
notificationRouter.patch('/markAsRead/:userId',tryCatch(markAsRead))

export default notificationRouter