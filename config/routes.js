const express=require('express')
const router=express.Router()
const {usersRouter}=require('../app/controllers/UserController')
const {requestformRouter}=require('../app/controllers/RequestFormController')
const {departmentsRouter}=require('../app/controllers/DepartmentController')
const {notificationRouter}=require('../app/controllers/NotificationController')
router.use('/users',usersRouter)
router.use('/requestform',requestformRouter)
router.use('/department',departmentsRouter)
router.use('/notification',notificationRouter)


module.exports={
    routes:router
}