const asyncHandler = require("express-async-handler");
const Car = require("../models/carModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Add a Car
const addCar = asyncHandler(async (req, res) => {
  const {
    marca,
    model,
    motorizare,
    pret,
    slug,
    caroserie,
    combustibil,
    an,
    capacitate_cilindrica,
    km,
    culoare,
    putere,
    cutie,
    descriere,
    vin,
    tractiune,
  } = req.body;

  if (!marca || !model) {
    res.status(400);
    throw new Error("Please fill in all the gaps!");
  }

  // Handle Image upload
  let uploadedFile;
  if (req.files) {
    // Save image to cloudinary
    const imgs = await Promise.all(
      req.files.map(async (item, index) => {
        try {
          uploadedFile = await cloudinary.uploader.upload(item.path, {
            folder: "Drive and Go App",
            resource_type: "image",
          });
        } catch (error) {
          res.status(500);
          throw new Error("Image was not uploaded");
        }
        return {
          fileName: req.files[index].originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.files[index].mimetype,
          fileSize: fileSizeFormatter(req.files[index].size, 2),
        };
      })
    );

    const car = await Car.create({
      marca,
      model,
      pret,
      motorizare,
      slug,
      caroserie,
      combustibil,
      an,
      capacitate_cilindrica,
      km,
      culoare,
      putere,
      cutie,
      descriere,
      vin,
      tractiune,
      imgs,
    });

    res.status(201).json(car);
  }
});

// Get all Cars
const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find();
  res.status(200).json(cars);
});

// Get cars based on query
const getCarsForm = asyncHandler(async (req, res) => {
  console.log(req.query);
  const queryObj = {};

  if (req.query.marca) {
    queryObj["marca"] = req.query.marca;
  }
  if (req.query.model) {
    queryObj["model"] = req.query.model;
  }
  if (req.query.caroserie) {
    queryObj["caroserie"] = req.query.caroserie;
  }
  if (req.query.combustibil) {
    queryObj["combustibil"] = req.query.combustibil;
  }
  if (req.query.pret_min || req.query_pret_max) {
    let minPret = parseInt(req.query.pret_min);
    let maxPret = parseInt(req.query.pret_max);
    queryObj["pret"] = { $gte: minPret, $lte: maxPret };
  }
  if (req.query.km_min || req.query.km_min) {
    let minKm = parseInt(req.query.km_min);
    let maxKm = parseInt(req.query.km_max);
    queryObj["km"] = {
      $gte: minKm,
      $lte: maxKm,
    };
  }
  if (req.query.an_min || req.query.max) {
    let minAn = parseInt(req.query.an_min);
    let maxAn = parseInt(req.query.an_max);
    queryObj["an"] = {
      $gte: minAn,
      $lte: maxAn,
    };
  }
  if (req.query.cc_min || req.query.cc_max) {
    let minCc = parseInt(req.query.cc_min);
    let maxCc = parseInt(req.query.cc_max);
    queryObj["capacitate_cilindrica"] = {
      $gte: minCc,
      $lte: maxCc,
    };
  }

  console.log(queryObj);

  const cars = await Car.find(queryObj);
  res.status(200).json(cars);
});

// Update Cars
const updateCar = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const {
    marca,
    model,
    pret,
    caroserie,
    motorizare,
    combustibil,
    an,
    capacitate_cilindrica,
    km,
    culoare,
    putere,
    cutie,
    descriere,
    vin,
    tractiune,
  } = req.body;

  const car = await Car.findOne({ slug: slug });

  // Check if product exists
  if (!car) {
    res.status(404);
    throw new Error("Product not found");
  }

  let uploadedFile;
  if (req.files) {
    // Save image to cloudinary
    const updatedImgs = await Promise.all(
      req.files.map(async (item, index) => {
        try {
          uploadedFile = await cloudinary.uploader.upload(item.path, {
            folder: "Drive and Go App",
            resource_type: "image",
          });
        } catch (error) {
          res.status(500);
          throw new Error("Image was not uploaded");
        }
        return {
          fileName: req.files[index].originalname,
          filePath: uploadedFile.secure_url,
          fileType: req.files[index].mimetype,
          fileSize: fileSizeFormatter(req.files[index].size, 2),
        };
      })
    );

    const updatedCar = await Car.findByIdAndUpdate(
      { _id: car._id },
      {
        marca,
        model,
        pret,
        slug,
        motorizare,
        caroserie,
        combustibil,
        an,
        capacitate_cilindrica,
        km,
        culoare,
        putere,
        cutie,
        descriere,
        vin,
        tractiune,
        imgs: Object.keys(updatedImgs).length === 0 ? car.imgs : updatedImgs,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedCar);
  }
});

const deleteCar = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Validator
  const car = await Car.findOne({ slug: slug });

  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  const carDel = await Car.findOneAndDelete(car._id);
  if (carDel) {
    res.status(200).json({ message: "Car deleted successfully!" });
  }
});

// Get single product
const getCar = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const car = await Car.findOne({ slug: slug });

  // Validator
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  res.status(200).json(car);
});

// Hot car
const patchHotCar = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const existentHotCar = await Car.findOne({ hotCar: true });
  const newCar = await Car.findOne({ slug: slug });

  if (existentHotCar) {
    await Car.findByIdAndUpdate(
      { _id: existentHotCar._id },
      {
        hotCar: false,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  const hotCar = await Car.findByIdAndUpdate(
    { _id: newCar._id },
    {
      hotCar: true,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(hotCar);
});

// Get hotCar
const getHotCar = asyncHandler(async (req, res) => {
  const car = await Car.findOne({ hotCar: true });

  // Validator
  if (!car) {
    res.status(404);
    throw new Error("Car not found");
  }

  res.status(200).json(car);
});

module.exports = {
  addCar,
  getCars,
  updateCar,
  deleteCar,
  getCar,
  patchHotCar,
  getHotCar,
  getCarsForm,
};
