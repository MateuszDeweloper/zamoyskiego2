import mongoose from 'mongoose';

export interface IProspekt {
  _id?: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  isActive: boolean;
  investment: string; // 'zamoyskiego-2' etc.
  description?: string;
  uploadedBy?: string;
}

const ProspektSchema = new mongoose.Schema<IProspekt>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  investment: {
    type: String,
    required: true,
    enum: ['zamoyskiego-2'],
    default: 'zamoyskiego-2',
  },
  description: {
    type: String,
    trim: true,
  },
  uploadedBy: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indeks dla szybszego wyszukiwania
ProspektSchema.index({ investment: 1, isActive: 1 });

const Prospekt = mongoose.models.Prospekt || mongoose.model<IProspekt>('Prospekt', ProspektSchema);

export default Prospekt;
