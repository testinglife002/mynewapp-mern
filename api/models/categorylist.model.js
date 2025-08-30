
import mongoose from 'mongoose';


const categoryListSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        required: true,
        unique: true,
      },
      type: {
        type: String,
        required: false,
      },
      categoryImage: { 
        type: String ,
        required: true,
      },
    },
    
    { timestamps: true }
  );

module.exports = mongoose.model('categorylist',categoryListSchema);

