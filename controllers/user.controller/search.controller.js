const Service = require("../../models/services.model.js");
const Profile = require("../../models/profile.model.js");

const getPopularSearches = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ searchCount: -1 })
      .limit(5)
      .select("+searchCount");

    res.status(200).json({
      status: 200,
      services,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

const search = async (req, res) => {
  try {
    const { query } = req.params;
    const { sort } = req.query; // <-- sorting comes from here

    const service = await Service.findOne({ title: query });
    if (!service) {
      return res.status(404).json({
        status: 404,
        message: `The service "${query}" was not found`,
      });
    }

    let sortOption = {};

    switch (sort) {
      case "popular":
        sortOption = { rating: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "price_low":
        sortOption = { pricePerHour: 1 };
        break;

      case "price_high":
        sortOption = { pricePerHour: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const nurses = (
      await Profile.find({
        services: { $in: [service._id] },
      })
        .select("+services -bookingHistory")
        .populate("services", "title")
        .populate({
          path: "user",
          match: { role: "nurse" },
          select: "name email role",
        })
        .sort(sortOption)
    ).filter((p) => p.user !== null);

    if (nurses.length === 0) {
      return res.status(404).json({
        status: 404,
        message: `No nurses offering the service "${query}" found`,
      });
    }

    service.searchCount += 1;
    await service.save();

    res.status(200).json({
      status: 200,
      sort: sort || "default",
      nurses,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { getPopularSearches, search };
