import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalOrders: number;
  totalSpent: number;
  notes: string;
  status: 'active' | 'inactive';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
