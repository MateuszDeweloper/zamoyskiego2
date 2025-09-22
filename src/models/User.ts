import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  hashedPassword: string;
  salt: string;
  role: 'admin' | 'user';
  isActive: boolean;
  email?: string;
  createdAt: Date;
  lastLogin?: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Nieprawidłowy format email'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indeksy dla lepszej wydajności
// Nie tworzymy indeksu dla username, ponieważ unique: true już tworzy indeks
UserSchema.index({ email: 1 });
UserSchema.index({ isActive: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
