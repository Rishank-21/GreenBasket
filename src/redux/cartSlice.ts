// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import mongoose from "mongoose";


// interface IGrocery {
//   _id?: mongoose.Types.ObjectId;
//   name: string;
//   category: string;
//   price: string;
//   unit: string;
//   quantity:number;
//   image: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// interface ICartSlice{
//     cartData : IGrocery[] 
// }

// const initialState:ICartSlice={
//     cartData:[]
// }

// const cartSlice = createSlice({
//     name : "cart",
//     initialState,
//     reducers:{
//         addToCart :(state, action:PayloadAction<IGrocery>) => {
//             state.cartData.push(action.payload)
//         },
//         increaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=> {
//             const item = state.cartData.find(i=>i._id==action.payload)
//             if(item){
//                 item.quantity = item.quantity + 1
//             }
//         },
//         decreaseQuantity:(state, action:PayloadAction<mongoose.Types.ObjectId>)=> {
//             const item = state.cartData.find(i=>i._id==action.payload)
//             if(item?.quantity && item.quantity > 1){
//                 item.quantity = item.quantity - 1
//             }else{
//                 state.cartData = state.cartData.filter(i => i._id !== action.payload)
//             }
//         }
//     }
// })


// export const {addToCart, increaseQuantity, decreaseQuantity} = cartSlice.actions
// export default cartSlice.reducer


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose, { Mongoose } from "mongoose";

interface IGrocery {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: string;
  unit: string;
  quantity: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[],
  subTotal: number,
  deliveryFee: number,
  finalTotal: number
}

const loadCartFromLocalStorage = (): IGrocery[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return [];
    return JSON.parse(raw) as IGrocery[];
  } catch (err) {
    return [];
  }
};

const saveCartToLocalStorage = (cart: IGrocery[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    // ignore
  }
};

const initialState: ICartSlice = {
  cartData: loadCartFromLocalStorage(),
  subTotal:0,
  deliveryFee:40,
  finalTotal:40
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IGrocery>) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotals(state)
      saveCartToLocalStorage(state.cartData);
    },
    increaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>
    ) => {
      const idStr = action.payload?.toString();
      const item = state.cartData.find((i) => i._id?.toString() === idStr);
      if (item) {
        item.quantity = item.quantity + 1;
        saveCartToLocalStorage(state.cartData);
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    decreaseQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>
    ) => {
      const idStr = action.payload?.toString();
      const item = state.cartData.find((i) => i._id?.toString() === idStr);
      if (item?.quantity && item.quantity > 1) {
        item.quantity = item.quantity - 1;
        saveCartToLocalStorage(state.cartData);
      } else {
        state.cartData = state.cartData.filter(
          (i) => i._id?.toString() !== idStr
        );
        saveCartToLocalStorage(state.cartData);
      }
      cartSlice.caseReducers.calculateTotals(state)
    },
    removeFromCart:(state, action:PayloadAction<mongoose.Types.ObjectId>) =>{
    state.cartData = state.cartData.filter((i) => i._id !== action.payload)
    cartSlice.caseReducers.calculateTotals(state)
  },
  calculateTotals:(state)=> {
    state.subTotal = state.cartData.reduce((sum,item)=>sum + Number(item.price)*item.quantity, 0)
    state.deliveryFee = state.subTotal>100 ? 0 : 40
    state.finalTotal = state.subTotal + state.deliveryFee
  }
  },

  
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, calculateTotals } =
  cartSlice.actions;
export default cartSlice.reducer;