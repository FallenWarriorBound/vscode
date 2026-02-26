import RefreshToken from '../models/RefreshToken.js';

export const enforceSessionRule = async ({ userId, deviceType, deviceId }) => {
  const sessions = await RefreshToken.find({ user: userId, revoked: false, deviceType }).sort({ createdAt: 1 });
  if (sessions.length >= 1) {
    sessions[0].revoked = true;
    await sessions[0].save();
  }
  return RefreshToken.create({ user: userId, token: `rt-${Date.now()}`, deviceType, deviceId, expiresAt: new Date(Date.now() + 7 * 86400000) });
};
