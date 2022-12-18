const router = require('express').Router();


const apiRoutes = require('./api');
const homeRoute = require('./api/homeRoute');
const DashRoutes = require('./DashRoute');

router.use('/', homeRoute);
router.use('/dashb', DashRoutes);
router.use('/api', apiRoutes);


module.exports = router;
