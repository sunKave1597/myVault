const AuditLog = require('../models/AuditLog');  
const os = require('os');
const https = require('https');

const getIpInfo = (ip) => {
  return new Promise((resolve) => {
    if (!ip || ip === '::1' || ip === '127.0.0.1') {
      return resolve({ isp: 'local', country: 'local', city: 'local' });
    }
    https.get(`https://ipapi.co/${ip}/json/`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            isp: json.org || 'unknown',
            country: json.country_name || 'unknown',
            city: json.city || 'unknown',
          });
        } catch (e) {
          resolve({ isp: 'unknown', country: 'unknown', city: 'unknown' });
        }
      });
    }).on('error', (err) => {
      resolve({ isp: 'unknown', country: 'unknown', city: 'unknown' });
    });
  });
};



const logAudit = async ({ userId, action, entity, entityId, detail, req }) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const hostname = os.hostname();
    const ipInfo = await getIpInfo(ip);

    const log = new AuditLog({
      userId,
      action,
      entity,
      entityId,
      detail,
      ip,
      userAgent,
      hostname,
      isp: ipInfo.isp,
      country: ipInfo.country,
      city: ipInfo.city,
    });

    await log.save();
  } catch (err) {
    console.error('Failed to save audit log:', err);
  }
};

module.exports = logAudit;
