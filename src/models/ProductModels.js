import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availability: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Preorder"],
    default: "In Stock",
  },
  colors: {
    type: [String],
    default: [],
  },
  storageOptions: {
    type: [String],
    default: [],
  },
  specifications: [
    {
      key: { type: String, required: true },
      value: { type: String, required: true },
    }
  ],
  accessories: {
    type: String,
  },
  deliveryTime: {
    type: String, // e.g. "2-5"
  },
  emiAvailable: {
    type: Boolean,
    default: false,
  },
  productImages: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
