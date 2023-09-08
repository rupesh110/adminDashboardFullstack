import mongoose from 'mongoose';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';


export const getAdmins = async (req, res) => {
    try {
      const admins = await User.find({ role: "admin" }).select("-password");
      res.status(200).json(admins);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
};

// export const getUserPerformance = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("🚀 ~ file: management.js:19 ~ getUserPerformance ~ id:", id)
//     res.status(200).json({ message: "success" , id});
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };
export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    
    // ID Validation
    if (!mongoose.Types.ObjectId.isValid(String(id).trim())) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    
    // Aggregation Query
    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id.trim()) }}, // <-- modified this line
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats"
        },
      },
      { $unwind: { path: "$affiliateStats", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          password: 0,
          
        }
      }
    ]);

    let saleTransactions = [];
       
    // res.status(200).json({ affiliateStats });
    // const saleTransactions = await Promise.all(
    //   userWithStats[0].affiliateStats.affiliateSales.map((id) => {
    //     return Transaction.findById(id);
    //   })
    // );

    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });;
  } catch (error) {
    console.error('Full Error:', error);
    res.status(500).json({ message: error.message });
  }
};




