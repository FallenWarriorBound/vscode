import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';
import { env } from '../config/env.js';

const chargeStep = async ({ userId, walletId, step, session }) => {
  // کسر هزینه هر مرحله ثبت‌نام با تراکنش اتمیک
  const wallet = await Wallet.findById(walletId).session(session);
  wallet.deductBalance('IRR', 80000);
  await wallet.save({ session });
  await Transaction.create([{ user: userId, wallet: walletId, type: 'fee', amount: 80000, currency: 'IRR', status: 'success', metadata: { step } }], { session });
};

export const step1Register = async (req, res) => {
  const { phone, email } = req.body;
  const user = await User.create({ phone, email, status: 'pending_verification', registrationStep: 1 });
  await Wallet.create({ user: user._id });
  res.json({ message: 'OTP sent', userId: user._id });
};

export const step2SetPassword = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await User.findById(req.user.userId).session(session);
      await user.setPassword(req.body.password);
      user.registrationStep = 2;
      await user.save({ session });
      const wallet = await Wallet.findOne({ user: user._id }).session(session);
      await chargeStep({ userId: user._id, walletId: wallet._id, step: 2, session });
    });
    res.json({ message: 'Step 2 completed' });
  } finally { session.endSession(); }
};

export const step3Identity = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await User.findById(req.user.userId).session(session);
      user.fullName = req.body.fullName;
      user.registrationStep = 3;
      await user.save({ session });
      const wallet = await Wallet.findOne({ user: user._id }).session(session);
      await chargeStep({ userId: user._id, walletId: wallet._id, step: 3, session });
    });
    res.json({ message: 'Step 3 completed' });
  } finally { session.endSession(); }
};

export const step4UploadDocs = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const user = await User.findById(req.user.userId).session(session);
      user.status = 'under_review';
      user.registrationStep = 4;
      await user.save({ session });
      const wallet = await Wallet.findOne({ user: user._id }).session(session);
      await chargeStep({ userId: user._id, walletId: wallet._id, step: 4, session });
    });
    res.json({ message: 'Submitted for review' });
  } finally { session.endSession(); }
};

export const login = async (req, res) => {
  const { phone, password, deviceType='desktop', deviceId='browser' } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !(await user.comparePassword(password))) {
    if (user) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) user.status = 'locked';
      await user.save();
    }
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  user.failedLoginAttempts = 0;
  await user.save();
  const token = jwt.sign({ userId: user._id, role: user.role, deviceId, deviceType, issuedAt: Date.now() }, env.jwtSecret, { expiresIn: '15m' });
  res.json({ token });
};

export const verify2FA = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const ok = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token: req.body.token });
  res.json({ verified: ok });
};

export const submitKYC = async (req, res) => {
  // شبیه‌سازی اعتبارسنجی OCR برای KYC
  const user = await User.findById(req.user.userId);
  user.kycVerified = true;
  await user.save();
  res.json({ message: 'KYC submitted and verified' });
};

export const registerBiometric = async (req, res) => {
  const user = await User.findById(req.user.userId);
  user.biometricCredentialId = req.body.credentialId;
  await user.save();
  res.json({ message: 'Biometric registered' });
};
