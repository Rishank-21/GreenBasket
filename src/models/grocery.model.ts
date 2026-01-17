import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Snacks & Biscuits",
        "Spices & Masalas",
        "Beverages & Drinks",
        "Personal Care",
        "Household Essentials",
        "Instant & Package Food",
        "Baby & Pet Care",
      ],
    },
    price: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum:[
        "Kg",
        "Gm",
        "Litre",
        "Ml",
        "Piece",
        "Pack"
      ]
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);


const Grocery = mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema)

export default Grocery