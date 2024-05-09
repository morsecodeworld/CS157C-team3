const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // Existing fields
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager"],
      default: "admin",
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware.
/*userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});*/

const User = mongoose.model("User", userSchema);

module.exports = User;
