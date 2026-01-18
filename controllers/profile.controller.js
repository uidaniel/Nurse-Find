const Nurse = require("../models/nurse.model.js");

const getNurseProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    let query = Nurse.findById(userId);

    // Always expose accountType so we know what to unlock
    query = query.select("+accountType");

    console.log(req.user);

    // INDIVIDUAL NURSE ACCOUNT
    if (req.user.accountType === "Individual") {
      query = query
        .select("+nursingInformation +verifyNurseCredentials")
        .populate("nursingInformation.areaOfSpecialization");
    }

    // ORGANIZATION ACCOUNT
    if (req.user.accountType === "Organization") {
      query = query.select(
        "+organisationDetails +organizationVerification +organizationRepresentative",
      );
    }

    const nurse = await query;

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: "Nurse profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: nurse,
    });
  } catch (error) {
    console.error("Get nurse profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getNurseProfile };
