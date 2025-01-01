const axios = require("axios");
const captainModel = require("../model/captain.model");

module.exports.calculateDistanceTime = async (origin, destination) => {
  try {
    // Geocode origin
    const originResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        origin
      )}.json`,
      {
        params: { access_token: process.env.MAPBOX_TOKEN },
      }
    );

    const destinationResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        destination
      )}.json`,
      {
        params: { access_token: process.env.MAPBOX_TOKEN },
      }
    );

    // Extract coordinates (longitude, latitude)
    const originCoords = originResponse.data.features[0]?.center;
    const destinationCoords = destinationResponse.data.features[0]?.center;

    if (!originCoords || !destinationCoords) {
      throw new Error("Unable to find one or both locations.");
    }

    // Use Mapbox Directions API to calculate distance
    const directionsResponse = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.join(
        ","
      )};${destinationCoords.join(",")}`,

      {
        params: {
          access_token: process.env.MAPBOX_TOKEN,
          geometries: "geojson",
        },
      }
    );

    const route = directionsResponse.data.routes[0];

    if (!route) {
      throw new Error("Unable to calculate a route.");
    }

    const distanceInMeters = route.distance; // Distance in meters
    const durationInSeconds = route.duration; // Duration in seconds

    return {
      origin,
      destination,
      distanceInKilometers: (distanceInMeters / 1000).toFixed(2),
      durationInMinutes: (durationInSeconds / 60).toFixed(2),
    };
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Error calculating distance.");
  }
};

module.exports.getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_TOKEN,
        },
      }
    );

    const coordinates = {
      latitude: response.data.features[0].center[1],
      longitude: response.data.features[0].center[0],
    };

    return coordinates;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Error fetching coordinates.");
  }
};

module.exports.getSuggestions = async (query) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_TOKEN,
          autocomplete: true,
          limit: 5, // Limit the number of suggestions
        },
      }
    );

    const suggestions = response.data.features.map((feature) => ({
      name: feature.place_name,
      coordinates: feature.center, // [longitude, latitude]
    }));

    return suggestions;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Error fetching suggestions.");
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  //radius in km
  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371],
      },
    },
  });

  return captains;
};
