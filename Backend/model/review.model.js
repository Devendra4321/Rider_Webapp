const mongoose = require('mongoose');
const captainModel = require('./captain.model');

const reviewSchema = new mongoose.Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
        required: true,
    },
    overallRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    vehicleRating: {
        type: Number,
        min: 1,
        max: 5,
    },
    onTimeRating: {
        type: Number,
        min: 1,
        max: 5,
    },
    driverBehaviourRating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

reviewSchema.statics.calculateAverageRatings = async function (captainId) {
    const stats = await this.aggregate([
      {
        $match: {
          captain: new mongoose.Types.ObjectId(captainId),
        },
      },
      {
        $group: {
          _id: '$captain',
          avgOverall: { $avg: '$overallRating' },
          avgVehicle: { $avg: '$vehicleRating' },
          avgOnTime: { $avg: '$onTimeRating' },
          avgBehaviour: { $avg: '$driverBehaviourRating' },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $project: {
          avgOverall: { $round: ['$avgOverall', 1] },
          avgVehicle: { $round: ['$avgVehicle', 1] },
          avgOnTime: { $round: ['$avgOnTime', 1] },
          avgBehaviour: { $round: ['$avgBehaviour', 1] },
          totalReviews: 1,
        },
      },
    ]);
  
    const finalStats = stats[0] || {
      avgOverall: 0,
      avgVehicle: 0,
      avgOnTime: 0,
      avgBehaviour: 0,
      totalReviews: 0,
    };
  
    //Save to Captain collection
    await captainModel.findByIdAndUpdate(captainId, {
      'averageRatings.overall': finalStats.avgOverall,
      'averageRatings.vehicle': finalStats.avgVehicle,
      'averageRatings.onTime': finalStats.avgOnTime,
      'averageRatings.behaviour': finalStats.avgBehaviour,
      'averageRatings.totalReviews': finalStats.totalReviews,
    });
  
    return finalStats;
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;