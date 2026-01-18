const mongoose = require("mongoose");

const stringRequired = {
  type: String,
  required: true,
};

const NurseSchema = new mongoose.Schema(
  {
    supabaseId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["nurse", "patient", "admin"],
      default: "nurse",
      required: true,
    },

    accountType: {
      type: String,
      enum: ["Individual", "Organization"],
      default: "Individual",
      select: false,
    },

    /* ================= NURSING ACCOUNT TYPE ================= */

    nursingInformation: {
      type: {
        nurseType: stringRequired,
        licenseNumber: stringRequired,
        yearsOfExperience: {
          type: Number,
          required: false,
        },
        areaOfSpecialization: {
          type: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Service",
            },
          ],
          required: true,
        },
      },
      select: false, // hides the whole nursingInformation object
    },

    verifyNurseCredentials: {
      type: {
        nursingLicense: stringRequired,
        governmentIdentification: stringRequired,
      },
      select: false,
    },

    /* ================= ORGANIZATION ACCOUNT TYPE ================= */

    organisationDetails: {
      type: {
        organizationName: stringRequired,
        organizationDescription: stringRequired,
        organizationEmail: stringRequired,
        organizationPhoneNumber: stringRequired,
      },
      select: false, // hides entire object
    },

    organizationVerification: {
      type: {
        operatingLicense: stringRequired,
        organizationProofOfAddress: stringRequired,
        organizationCACDocument: stringRequired,
        taxIdentificationNumber: stringRequired,
      },
      select: false,
    },

    organizationRepresentative: {
      type: {
        fullName: stringRequired,
        role: {
          type: String,
          required: true,
          enum: ["HR Manager", "Founder", "Director"],
        },
        phoneNumber: stringRequired,
      },
      select: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Nurse", NurseSchema);
