const axios = require("axios");
const mapService = require("../services/map.service");

module.exports.getCoordinates = async (req, res, next) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const coordinates = await mapService.getCoordinates(address);
    res.status(200).json({
      statusCode: 200,
      data: coordinates,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: error.message,
    });
  }
};

module.exports.getDistanceTime = async (req, res, next) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json({
      statusCode: 400,
      error: "Both 'origin' and 'destination' query parameters are required.",
    });
  }

  try {
    const result = await mapService.calculateDistanceTime(origin, destination);
    res.status(200).json({ statusCode: 200, data: result });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      error: "Error calculating distance.",
    });
  }
};

module.exports.getSuggestion = async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      statusCode: 400,
      error: "Query parameter 'query' is required.",
    });
  }

  try {
    const suggestions = await mapService.getSuggestions(query);
    res.status(200).json({ statusCode: 200, suggestions });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      statusCode: 500,
      error: "Error fetching suggestions.",
    });
  }
};
