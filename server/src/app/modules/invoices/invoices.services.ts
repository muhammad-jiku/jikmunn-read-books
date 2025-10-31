/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer';
import httpStatus from 'http-status';
import mongoose, { SortOrder } from 'mongoose';
import PDFDocument from 'pdfkit';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Order } from '../orders/orders.model';
import { User } from '../users/users.model';
import { invoiceSearchableFields } from './invoices.constants';
import { IInvoice, IInvoiceFilters } from './invoices.interfaces';
import { Invoice } from './invoices.model';

const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${timestamp}-${random}`;
};

const createInvoiceFromOrder = async (
  orderId: string,
): Promise<IInvoice | null> => {
  const session = await mongoose.startSession();
  let newInvoice = null;

  try {
    session.startTransaction();

    const order = await Order.findById(orderId)
      .populate('user')
      .populate('items.book')
      .session(session);

    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Check if invoice already exists for this order
    const existingInvoice = await Invoice.findOne({ order: orderId }).session(
      session,
    );
    if (existingInvoice) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invoice already exists for this order',
      );
    }

    const user = await User.findById((order as any).user).session(session);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Calculate due date (15 days from invoice date)
    const invoiceDate = new Date();
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 15);

    // Prepare invoice items
    const invoiceItems = (order as any).items.map((item: any) => ({
      book: (item.book as any)._id,
      title: (item.book as any).title,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.quantity * item.price,
      ebookAccess: item.ebookAccess,
    }));

    // Calculate totals
    const subtotal = (order as any).totalAmount;
    const vat = (order as any).vat || 0;
    const surcharge = (order as any).surcharge || 0;
    const discount = 0; // Could be calculated from coupons
    const totalAmount = (order as any).payable;

    // Get user email for billing address
    let userEmail = 'customer@example.com';
    if (user) {
      const customer = await mongoose
        .model('Customer')
        .findOne({ _id: (user as any).customer })
        .session(session);
      if (customer) {
        userEmail = (customer as any).email;
      }
    }

    const invoiceData: IInvoice = {
      invoiceNumber: generateInvoiceNumber(),
      order: (order as any)._id,
      user: (order as any).user,
      invoiceDate,
      dueDate,
      items: invoiceItems,
      subtotal,
      vat,
      surcharge,
      discount,
      totalAmount,
      paymentStatus:
        (order as any).paymentStatus === 'completed' ? 'paid' : 'pending',
      billingAddress: {
        name: (order as any).shippingAddress.name,
        address: (order as any).shippingAddress.address,
        city: (order as any).shippingAddress.city,
        state: (order as any).shippingAddress.state,
        postcode: (order as any).shippingAddress.postcode,
        country: (order as any).shippingAddress.country,
        phone: (order as any).shippingAddress.phone,
        email: userEmail,
      },
      shippingAddress: (order as any).shippingAddress,
      paymentMethod: (order as any).paymentMethod,
      transactionId: (order as any).tran_id,
      notes: 'Thank you for your purchase!',
      terms: 'Payment due within 15 days',
      isGenerated: false,
    };

    const invoice = await Invoice.create([invoiceData], { session });
    if (!invoice.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create invoice');
    }

    newInvoice = invoice[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  // Populate invoice data
  if (newInvoice) {
    newInvoice = await Invoice.findById(newInvoice._id)
      .populate('order')
      .populate('user')
      .populate('items.book');
  }

  return newInvoice;
};

const generateInvoicePDF = async (invoiceId: string): Promise<Buffer> => {
  const invoice = await Invoice.findById(invoiceId)
    .populate('user')
    .populate('items.book')
    .populate('order');

  if (!invoice) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: any[] = [];

      doc.on('data', (buffer: any) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('BOOKSTORE INVOICE', 50, 50);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Invoice #: ${(invoice as any).invoiceNumber}`, 50, 80);
      doc.text(
        `Date: ${(invoice as any).invoiceDate.toLocaleDateString()}`,
        50,
        95,
      );
      doc.text(
        `Due Date: ${(invoice as any).dueDate.toLocaleDateString()}`,
        50,
        110,
      );

      // Company Info
      doc
        .text('BookStore Ltd.', 400, 80)
        .text('123 Book Street', 400, 95)
        .text('Dhaka 1212, Bangladesh', 400, 110)
        .text('Phone: +880 1234-567890', 400, 125)
        .text('Email: info@bookstore.com', 400, 140);

      // Billing Address
      doc
        .text('Bill To:', 50, 150)
        .font('Helvetica-Bold')
        .text((invoice as any).billingAddress.name, 50, 165)
        .font('Helvetica')
        .text((invoice as any).billingAddress.address, 50, 180)
        .text(
          `${(invoice as any).billingAddress.city}, ${(invoice as any).billingAddress.state} ${(invoice as any).billingAddress.postcode}`,
          50,
          195,
        )
        .text((invoice as any).billingAddress.country, 50, 210)
        .text(`Phone: ${(invoice as any).billingAddress.phone}`, 50, 225)
        .text(`Email: ${(invoice as any).billingAddress.email}`, 50, 240);

      // Line
      doc.moveTo(50, 270).lineTo(550, 270).stroke();

      // Table Header
      let yPosition = 290;
      doc
        .font('Helvetica-Bold')
        .text('Description', 50, yPosition)
        .text('Qty', 300, yPosition)
        .text('Unit Price', 350, yPosition)
        .text('Total', 450, yPosition);

      yPosition += 20;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

      // Table Rows
      doc.font('Helvetica');
      (invoice as any).items.forEach((item: any) => {
        yPosition += 20;
        doc
          .text(item.title, 50, yPosition, { width: 240 })
          .text(item.quantity.toString(), 300, yPosition)
          .text(`$${item.unitPrice.toFixed(2)}`, 350, yPosition)
          .text(`$${item.totalPrice.toFixed(2)}`, 450, yPosition);
      });

      yPosition += 30;
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

      // Totals
      yPosition += 20;
      doc
        .text('Subtotal:', 400, yPosition)
        .text(`$${(invoice as any).subtotal.toFixed(2)}`, 450, yPosition);

      yPosition += 20;
      doc
        .text('VAT:', 400, yPosition)
        .text(`$${(invoice as any).vat.toFixed(2)}`, 450, yPosition);

      if ((invoice as any).surcharge > 0) {
        yPosition += 20;
        doc
          .text('Surcharge:', 400, yPosition)
          .text(`$${(invoice as any).surcharge.toFixed(2)}`, 450, yPosition);
      }

      if ((invoice as any).discount > 0) {
        yPosition += 20;
        doc
          .text('Discount:', 400, yPosition)
          .text(`-$${(invoice as any).discount.toFixed(2)}`, 450, yPosition);
      }

      yPosition += 25;
      doc
        .font('Helvetica-Bold')
        .text('Total:', 400, yPosition)
        .text(`$${(invoice as any).totalAmount.toFixed(2)}`, 450, yPosition);

      // Payment Status
      yPosition += 40;
      doc
        .font('Helvetica-Bold')
        .text(
          `Payment Status: ${(invoice as any).paymentStatus.toUpperCase()}`,
          50,
          yPosition,
        );

      // Notes
      if ((invoice as any).notes) {
        yPosition += 40;
        doc.font('Helvetica-Bold').text('Notes:', 50, yPosition);
        doc
          .font('Helvetica')
          .text((invoice as any).notes, 50, yPosition + 15, { width: 500 });
      }

      // Terms
      if ((invoice as any).terms) {
        yPosition += 60;
        doc.font('Helvetica-Bold').text('Terms & Conditions:', 50, yPosition);
        doc
          .font('Helvetica')
          .text((invoice as any).terms, 50, yPosition + 15, { width: 500 });
      }

      // Footer
      doc
        .fontSize(8)
        .text('Thank you for your business!', 50, 700)
        .text('BookStore Ltd. - Your trusted book partner', 50, 715);

      doc.end();

      // Mark invoice as generated
      (invoice as any).isGenerated = true;
      (invoice as any).generatedAt = new Date();
      invoice.save().catch(() => {
        // ignore save errors (cannot reject here because PDF is already generated)
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllInvoices = async (
  filters: IInvoiceFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IInvoice[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: invoiceSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'startDate' || field === 'endDate') {
          return {};
        }
        return { [field]: value };
      }),
    });
  }

  // Date range filter
  if (filtersData.startDate || filtersData.endDate) {
    const dateFilter: any = {};
    if (filtersData.startDate) {
      dateFilter.$gte = new Date(filtersData.startDate);
    }
    if (filtersData.endDate) {
      dateFilter.$lte = new Date(filtersData.endDate);
    }
    andConditions.push({
      invoiceDate: dateFilter,
    });
  }

  // Amount range filter
  if (filtersData.minAmount || filtersData.maxAmount) {
    const amountFilter: any = {};
    if (filtersData.minAmount) {
      amountFilter.$gte = Number(filtersData.minAmount);
    }
    if (filtersData.maxAmount) {
      amountFilter.$lte = Number(filtersData.maxAmount);
    }
    andConditions.push({
      totalAmount: amountFilter,
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Invoice.find(whereConditions)
    .populate('order')
    .populate('user')
    .populate('items.book')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Invoice.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getInvoice = async (id: string): Promise<IInvoice | null> => {
  const result = await Invoice.findById(id)
    .populate('order')
    .populate('user')
    .populate('items.book');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  return result;
};

const getUserInvoices = async (userId: string): Promise<IInvoice[]> => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await Invoice.find({ user: user._id })
    .populate('order')
    .populate('items.book')
    .sort({ invoiceDate: -1 });

  return result;
};

const updateInvoicePaymentStatus = async (
  invoiceId: string,
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled',
): Promise<IInvoice | null> => {
  const result = await Invoice.findByIdAndUpdate(
    invoiceId,
    { paymentStatus },
    { new: true },
  )
    .populate('order')
    .populate('user')
    .populate('items.book');

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }

  return result;
};

const deleteInvoice = async (id: string): Promise<IInvoice | null> => {
  const result = await Invoice.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found');
  }
  return result;
};

export const InvoiceServices = {
  createInvoiceFromOrder,
  generateInvoicePDF,
  getAllInvoices,
  getInvoice,
  getUserInvoices,
  updateInvoicePaymentStatus,
  deleteInvoice,
};
