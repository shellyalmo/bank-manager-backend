import mongoose from "mongoose";
import slugify from "slugify";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a user name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    email: {
      type: String,
      unique: [true, "email already exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    cash: { type: Number, default: 0 },
    credit: { type: Number, default: 0, min: [0, "Credit cannot be negative"] },
  },
  {
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Middleware - Create slug from name
UserSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model("User", UserSchema);
