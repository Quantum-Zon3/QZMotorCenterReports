const mongoose = require('mongoose');

// Esquema de cada ítem dentro del reporte (productos vendidos)
const saleItemSchema = new mongoose.Schema({
  productId:   { type: String, required: true },
  productName: { type: String, required: true },
  quantity:    { type: Number, required: true },
  unitPrice:   { type: Number, required: true },
  subtotal:    { type: Number, required: true }
});

// Esquema principal del reporte
const reportSchema = new mongoose.Schema({
  orderId:    { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  items:      [saleItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  saleDate: { type: Date, default: Date.now }
}, {
  timestamps: true // agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Report', reportSchema);