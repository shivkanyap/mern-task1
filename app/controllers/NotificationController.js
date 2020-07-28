const express = require('express');
const router = express.Router();
const { Notification } = require('../models/Notification');
const { authenticateUser } = require('../middleware/authentication');

router.post('/create', authenticateUser, (req, res) => {
    const body = req.body;
    notification = new Notification(body);
    notification
    .save()
    .then(notification => res.send(notification))
    .catch(err => res.send(err));
});

router.get('/all', authenticateUser, (req, res) => {
    Notification.find({ userid: req.user._id })
    .then(notification => res.send({ notification }))
    .catch(err => res.send(err));
});
module.exports = {
  notificationRouter: router
};