const express = require('express');
const router = express.Router();
const {
    createSaleReport,
    getReportByCustomer,
    getReportByProduct,
    getReportByPeriod,
    getAllReports
} = require('../controlador/ReportControlador');

// Recibir datos de otros microservicios
router.post('/sale', createSaleReport);

// Consultar reportes
router.get('/', getAllReports);
router.get('/by-customer/:customerId', getReportByCustomer);
router.get('/by-product', getReportByProduct);
router.get('/by-period', getReportByPeriod);

module.exports = router;