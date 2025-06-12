const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  action: { type: String, required: true }, 
  entity: { type: String, required: false }, 
  entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  timestamp: { type: Date, default: Date.now },
  detail: { type: String, required: false },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
