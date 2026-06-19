import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
  {
    coinId: String,
    coinName: String,
    coinSymbol: String,
    quantity: Number,
    buyPrice: Number,
    addedAt: Number,
  },
  { _id: false }
);

const alertSchema = new mongoose.Schema(
  {
    id: String,
    coinId: String,
    coinName: String,
    targetPrice: Number,
    condition: { type: String, enum: ['above', 'below'] },
    triggered: { type: Boolean, default: false },
    createdAt: Number,
  },
  { _id: false }
);

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    watchlist: {
      type: [String],
      default: [],
    },
    portfolio: {
      type: [holdingSchema],
      default: [],
    },
    alerts: {
      type: [alertSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserData = mongoose.model('UserData', userDataSchema);