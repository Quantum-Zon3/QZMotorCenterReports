const Report = require('../modelo/Reports');

// ─── RECIBIR DATOS DE OTRO MICROSERVICIO ──────────────────────────────────────
// POST /api/reports/sale
// Los otros servicios llaman a este endpoint para registrar una venta
const createSaleReport = async (req, res) => {
  try {
    const { items, totalAmount, saleDate } = req.body;

    const report = new Report({
      items,
      totalAmount,
      saleDate: saleDate || new Date()
    });

    await report.save();
    res.status(201).json({ message: '', data: report });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar la venta', error: error.message });
  }
};

// ─── REPORTE: VENTAS POR CLIENTE ──────────────────────────────────────────────
// GET /api/reports/by-customer/:customerId
const getReportByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const sales = await Report.find({ customerId }).sort({ saleDate: -1 });

    const totalSpent = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);

    res.json({
      customerId,
      totalOrders: sales.length,
      totalSpent: totalSpent.toFixed(2),
      orders: sales
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte por cliente', error: error.message });
  }
};

// ─── REPORTE: VENTAS POR PRODUCTO ─────────────────────────────────────────────
// GET /api/reports/by-product
const getReportByProduct = async (req, res) => {
  try {
    // Usamos aggregate de MongoDB para agrupar por producto
    const productReport = await Report.aggregate([
      { $unwind: '$items' }, // descompone el array de items
      {
        $group: {
          _id: '$items.productId',
          productName:    { $first: '$items.productName' },
          totalQuantity:  { $sum: '$items.quantity' },
          totalRevenue:   { $sum: '$items.subtotal' },
          totalOrders:    { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } } // ordenar de mayor a menor ingreso
    ]);

    res.json({
      totalProducts: productReport.length,
      products: productReport
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte por producto', error: error.message });
  }
};

// ─── REPORTE: VENTAS POR PERÍODO ──────────────────────────────────────────────
// GET /api/reports/by-period?start=2024-01-01&end=2024-01-31
const getReportByPeriod = async (req, res) => {
  try {
    const { start, end, groupBy } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'Debes enviar start y end como query params. Ej: ?start=2024-01-01&end=2024-01-31' });
    }

    const startDate = new Date(start);
    const endDate   = new Date(end);
    endDate.setHours(23, 59, 59, 999); // incluir todo el último día

    // Formato de agrupación: día o mes
    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const periodReport = await Report.aggregate([
      {
        $match: {
          saleDate: { $gte: startDate, $lte: endDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$saleDate' } },
          totalSales:  { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // ordenar cronológicamente
    ]);

    const grandTotal = periodReport.reduce((acc, p) => acc + p.totalSales, 0);

    res.json({
      period: { start, end, groupBy: groupBy || 'day' },
      grandTotal: grandTotal.toFixed(2),
      breakdown: periodReport
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al generar reporte por período', error: error.message });
  }
};

// ─── LISTAR TODOS LOS REPORTES ────────────────────────────────────────────────
// GET /api/reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ saleDate: -1 });
    res.json({ total: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
  }
};

//──────────────────────────────────────────────── CREAR REPORTE 200OK ────────────────────────────────────────────────
//POST: /api/reports/200OK
const createReport200OK = async (req, res) => {
  try {
    const { items, totalAmount, saleDate } = req.body;

    const report = new Report({
      items,
      totalAmount,
      saleDate: saleDate || new Date()
    });

    await report.save();
    res.status(201).json({ message: 'Reporte creado exitosamente', data: report });

  } catch (error) {
    res.status(500).json({ message: 'Error al crear el reporte', error: error.message });
  }
};

module.exports = {
  createSaleReport,
  getReportByCustomer,
  getReportByProduct,
  getReportByPeriod,
  getAllReports,
  createReport200OK
};