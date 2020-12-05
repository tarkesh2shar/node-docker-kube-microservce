import mongoose from "mongoose";
import { Password } from "../services/password";
//interface for  User
interface UserAttrs {
  email: string;
  password: string;
}
//interface for UserModel
interface UserModel extends mongoose.Model<UserDoc> {
  build(atts: UserAttrs): UserDoc;
}
//interface for output//
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
  }
);
userSchema.pre("save", async function name(done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
// const user= User.build({email:"ads",password:"ADs"})
export { User };
