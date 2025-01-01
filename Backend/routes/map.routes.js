const router = require("express").Router();
const mapController = require("../controller/map.controller");

router.get("/getCoordinates", mapController.getCoordinates);

router.get("/getDistanceTime", mapController.getDistanceTime);

router.get("/getSuggestion", mapController.getSuggestion);

module.exports = router;
