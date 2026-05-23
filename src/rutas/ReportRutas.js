const express = require('express');
const router = express.Router();
const {
    createSaleReport,
    getReportByProduct,
    getAllReports,
    createReport200OK
} = require('../controlador/ReportControlador');

// Recibir datos de otros microservicios
router.post('/sale', createSaleReport);

// Consultar reportes
router.get('/', getAllReports);
router.get('/product/:productId', getReportByProduct);

// Crear reporte 200OK
router.post('/200OK', createReport200OK);

module.exports = router;