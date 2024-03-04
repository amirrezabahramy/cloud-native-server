const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
      validate: [
        function (value) {
          return this.fromDate < value;
        },
      ],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

schema.pre("findOneAndUpdate", function (next) {
  this.setOptions({ runValidators: true, new: true });
  next();
});

const model = mongoose.model("Schedule", schema);

module.exports = model;
