import RefreshToken from '../models/RefreshToken.js';

export const listSessions = async (req, res) => {
  const sessions = await RefreshToken.find({ user: req.user.userId, revoked: false }).select('deviceId deviceType createdAt');
  res.json(sessions);
};

export const revokeSession = async (req, res) => {
  await RefreshToken.updateOne({ user: req.user.userId, _id: req.body.sessionId }, { revoked: true });
  res.json({ message: 'Session revoked' });
};
