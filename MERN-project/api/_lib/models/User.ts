import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar: string;
  provider: 'local' | 'google';
  providerId: string;
  role: 'admin' | 'user';
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  avatar: { type: String, default: '' },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  providerId: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'user'], default: 'admin' },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
