import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",//mean userSchema
        required: true,
    },
    courseId:{
        type:mongoose.Types.ObjectId,
        ref:"Course",//mean courseSchema
        required: true,
    }
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);