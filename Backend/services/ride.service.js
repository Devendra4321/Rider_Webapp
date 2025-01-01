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

  const baseFare = {
    auto: 30,
    car: 50,
    motorcycle: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    motorcycle: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    motorcycle: 1.5,
  };

  const fare = {
    auto: (
      baseFare.auto +
      perKmRate.auto * distanceTime.distanceInKilometers +
      perMinuteRate.auto * distanceTime.durationInMinutes
    ).toFixed(2),
    car: (
      baseFare.car +
      perKmRate.car * distanceTime.distanceInKilometers +
      perMinuteRate.car * distanceTime.durationInMinutes
    ).toFixed(2),
    motorcycle: (
      baseFare.motorcycle +
      perKmRate.motorcycle * distanceTime.distanceInKilometers +
      perMinuteRate.motorcycle * distanceTime.durationInMinutes
    ).toFixed(2),
  };

  return fare;
};

module.exports.getOtp = (num) => {
  const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num));
  return otp;
};
