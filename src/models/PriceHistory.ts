import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceHistory extends Document {
  buildingNumber: string | number;
  unitNumber: string | number;
  price: number;
  pricePerM2: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PriceHistorySchema: Schema = new Schema(
  {
    buildingNumber: {
      type: Schema.Types.Mixed,
      required: true,
    },
    unitNumber: {
      type: Schema.Types.Mixed,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pricePerM2: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indeks dla szybszego wyszukiwania
PriceHistorySchema.index({ buildingNumber: 1, unitNumber: 1, date: 1 });

export default mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);

