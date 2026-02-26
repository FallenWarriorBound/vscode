import mongoose from 'mongoose';
import Wallet from '../models/Wallet.js';
import Transaction from '../models/Transaction.js';

export class WalletService {
  constructor() { this.rates = { IRR_USDT: 0.000024, IRR_GOLD: 0.0000013 }; }

  async deductWithLock({ walletId, amount, currency = 'IRR', userId, reason = 'fee' }) {
    const session = await mongoose.startSession();
    return session.withTransaction(async () => {
      const wallet = await Wallet.findById(walletId).session(session);
      wallet.deductBalance(currency, amount);
      await wallet.save({ session });
      await Transaction.create([{ user: userId, wallet: walletId, type: reason, amount, currency, status: 'success' }], { session });
      return wallet;
    }).finally(() => session.endSession());
  }

  convertCurrency(amount, from, to) {
    const key = `${from}_${to}`;
    const rate = this.rates[key] || (1 / this.rates[`${to}_${from}`]);
    const gross = amount * rate;
    const fee = gross * 0.005;
    return { converted: Number((gross - fee).toFixed(2)), fee: Number(fee.toFixed(2)), rate };
  }
}
