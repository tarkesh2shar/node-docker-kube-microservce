import mongoose from "mongoose";
interface PaymentAttrs {
  orderId: string;
  striptId: string;
}
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  striptId: string;
  version: number;
}
interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    striptId: {
      required: true,
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
//@ts-ignore
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};
const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
export { Payment };
