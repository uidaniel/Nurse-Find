// controllers/profileCompletion.controller.js
const Nurse = require("../../models/nurse.model.js");

exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      nursingInformation,
      organisationDetails,
      organizationVerification,
      organizationRepresentative,
    } = req.body;

    const user = await Nurse.findById(userId).select("+accountType");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    let updateData = {};

    // INDIVIDUAL NURSE PROFILE COMPLETION
    if (user.accountType === "Individual") {
      if (!nursingInformation) {
        return res.status(400).json({
          success: false,
          message: "Nursing information is required for Individual accounts",
        });
      }

      const {
        nurseType,
        licenseNumber,
        yearsOfExperience,
        areaOfSpecialization,
      } = nursingInformation;

      if (!nurseType || !licenseNumber || !areaOfSpecialization) {
        return res.status(400).json({
          success: false,
          message: "Incomplete nursing information",
        });
      }

      updateData.nursingInformation = {
        nurseType,
        licenseNumber,
        yearsOfExperience,
        areaOfSpecialization,
      };
    }

    // ORGANIZATION PROFILE COMPLETION
    if (user.accountType === "Organization") {
      if (
        !organisationDetails ||
        !organizationVerification ||
        !organizationRepresentative
      ) {
        return res.status(400).json({
          success: false,
          message: "All organization information sections are required",
        });
      }

      updateData.organisationDetails = organisationDetails;
      updateData.organizationVerification = organizationVerification;
      updateData.organizationRepresentative = organizationRepresentative;
    }

    const updatedUser = await Nurse.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
      .select("+nursingInformation")
      .select("+organisationDetails")
      .select("+organizationVerification")
      .select("+organizationRepresentative");

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data:
        user.accountType === "Individual"
          ? updatedUser.nursingInformation
          : {
              organisationDetails: updatedUser.organisationDetails,
              organizationVerification: updatedUser.organizationVerification,
              organizationRepresentative:
                updatedUser.organizationRepresentative,
            },
    });
  } catch (error) {
    console.error("Profile completion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
