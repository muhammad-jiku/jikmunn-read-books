import { model, Schema } from 'mongoose';
import { IOrder, IOrderModel } from './orders.interfaces';

const orderItemSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  ebookAccess: {
    type: Boolean,
    default: false,
  },
});

const shippingAddressSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  postcode: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
});

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    vat: {
      type: Number,
      default: 0,
      min: 0,
    },
    surcharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    payable: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'bkash', 'nagad', 'rocket', 'bank', 'cod'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    tran_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    val_id: {
      type: String,
    },
    paymentGateway: {
      type: String,
      enum: ['sslcommerz', 'stripe', 'paypal', 'bkash', 'manual'],
      default: 'sslcommerz',
    },
    orderNotes: {
      type: String,
      trim: true,
    },
    estimatedDelivery: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// Indexes for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ deliveryStatus: 1 });
orderSchema.index({ tran_id: 1 }, { unique: true, sparse: true });
orderSchema.index({ createdAt: -1 });

// Virtual for order summary
orderSchema.virtual('itemCount').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save middleware to calculate payable amount
orderSchema.pre('save', function (next) {
  if (
    this.isModified('totalAmount') ||
    this.isModified('vat') ||
    this.isModified('surcharge')
  ) {
    this.payable = this.totalAmount + this.vat + this.surcharge;
  }
  next();
});

export const Order = model<IOrder, IOrderModel>('Order', orderSchema);
