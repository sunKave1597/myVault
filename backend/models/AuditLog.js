const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true },
  entity: { type: String, required: false },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  detail: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },
  hostname: { type: String },
  userAgent: { type: String },
  isp: { type: String },
  country: { type: String },
  city: { type: String },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
