const AuditLog = require('../models/AuditLog');

async function logAudit({ userId, action, entity, entityId, detail }) {
  try {
    const log = new AuditLog({ userId, action, entity, entityId, detail });
    await log.save();
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
}

module.exports = logAudit;
