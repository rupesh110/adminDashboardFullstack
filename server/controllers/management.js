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

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Received ID:', id);

    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id.trim())) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const userWithStats = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(id) }},
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats"
        },
      },
      { $unwind: { path: "$affiliateStats", preserveNullAndEmptyArrays: true } },
    ]);

    console.log('User With Stats:', userWithStats);

    if (!userWithStats || !userWithStats.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats?.affiliateSales?.map((id) => {
        return Transaction.findById(id);
      }) || []
    );

    const filteredTransactions = saleTransactions.filter((transaction) => transaction !== null);

    res.status(200).json({ user: userWithStats[0], sales: filteredTransactions });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
