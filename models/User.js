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
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
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

// Cascade delete account when a user is deleted
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Account being removed from user ${this._id}`);
    await this.model("Account").deleteMany({ user: this._id });
    next();
  }
);

// Reverse populate with virtuals
UserSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

export default mongoose.model("User", UserSchema);
