import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  title: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['active', 'archived', 'draft'], default: 'active' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ItemSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
