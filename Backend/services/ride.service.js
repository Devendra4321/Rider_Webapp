const vehicleModel = require("../model/vehicle.model");
const mapService = require("./map.service");
const crypto = require("crypto");

module.exports.getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    return "Pickup and destination are required";
  }

  const distanceTime = await mapService.calculateDistanceTime(
    pickup,
    destination
  );

  if (!distanceTime) {
    return "Failed to calculate distance and time";
  }

  const vehicles = await vehicleModel.find();

  if (!vehicles || vehicles.length === 0) {
    return "No vehicles available";
  }

  const fare = vehicles.map(vehicle => {
    const totalFare = (
      vehicle.baseFare +
      vehicle.perKmRate * distanceTime.distanceInKilometers +
      vehicle.perMinuteRate * distanceTime.durationInMinutes
    );
  
    return {
      vehicleType: vehicle.vehicleName,
      vehicleImage: vehicle.vehicleImage,
      description: vehicle.description,
      fare: totalFare.toFixed(2),
      discountedFare: (totalFare - vehicle.discountedFare).toFixed(2),
    };
  });

  return fare;
};

module.exports.getOtp = (num) => {
  const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
  return otp;
};
