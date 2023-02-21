const mongoose = require("mongoose");

const carSchema = mongoose.Schema(
  {
    marca: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    motorizare: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    pret: {
      type: Number,
      required: false,
      trim: true,
    },
    caroserie: {
      type: String,
      required: true,
      trim: true,
    },

    combustibil: {
      type: String,
      required: true,
      trim: true,
    },
    an: {
      type: Number,
      required: true,
      trim: true,
      min: 1900,
    },
    capacitate_cilindrica: {
      type: Number,
      required: false,
      trim: true,
    },
    km: {
      type: Number,
      required: true,
      trim: true,
    },
    culoare: {
      type: String,
      required: true,
      trim: true,
    },
    putere: {
      type: Number,
      required: true,
      trim: true,
    },
    cutie: {
      type: String,
      required: true,
      trim: true,
    },
    vin: {
      type: String,
      required: true,
      trim: true,
    },
    tractiune: {
      type: String,
      required: true,
      trim: true,
    },
    descriere: {
      type: String,
      required: false,
    },
    imgs: {
      type: Array,
      required: false,
    },
    hotCar: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
