const mongoose = require('mongoose');

// Esquema de cada ítem dentro del reporte (productos vendidos)
const saleItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productType: { type: String, required: true },
  productName: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true }
});

// Esquema principal del reporte
const reportSchema = new mongoose.Schema({
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true, default: 0 },
  saleDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  eventType: {
    type: String,
    enum: ['create', 'sale', 'delete', 'other'],
    default: 'create'
  }
});

module.exports = mongoose.model('Report', reportSchema);