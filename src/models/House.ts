import mongoose, { Schema, Document } from 'mongoose';

export interface IHouse extends Document {
  buildingNumber: string | number;
  unitNumber: string | number;
  area: number;
  price: number;
  pricePerM2: number;
  auxiliaryRooms?: string;
  isAvailable: boolean;
  status: 'available' | 'unavailable' | 'sold-transferred' | 'sold-not-transferred' | 'reserved';
  floor: string;
  plans?: {
    parter?: string;
    pietro?: string;
  };
  vertices?: {
    x: number;
    y: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const HouseSchema: Schema = new Schema(
  {
    buildingNumber: {
      type: Schema.Types.Mixed,
      required: true,
    },
    unitNumber: {
      type: Schema.Types.Mixed,
      required: true,
    },
    area: {
      type: Number,
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
    auxiliaryRooms: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['available', 'unavailable', 'sold-transferred', 'sold-not-transferred', 'reserved'],
      default: 'available',
    },
    floor: {
      type: String,
      required: true,
    },
    plans: {
      parter: String,
      pietro: String,
    },
    vertices: [{
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indeks dla szybszego wyszukiwania
HouseSchema.index({ buildingNumber: 1, unitNumber: 1 }, { unique: true });

export default mongoose.models.House || mongoose.model<IHouse>('House', HouseSchema);

