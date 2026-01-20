const Nurse = require("../../models/nurse.model");

const toggleActiveStatus = async (req, res) => {
  try {
    const id = req.user.id;
    const nurse = await Nurse.findOne({ _id: id });
    if (!nurse) {
      return res.status(400).json({
        status: 400,
        message: "Nurse not found",
      });
    }
    const activeStatus = nurse.activeStatus;
    console.log("nurse:", nurse);
    console.log(activeStatus);
    let status;
    if (activeStatus) {
      status = false;
    } else {
      status = true;
    }
    const changedActiveStatus = await Nurse.findByIdAndUpdate(id, {
      activeStatus: status,
    });
    if (!changedActiveStatus) {
      return res.status(400).json({
        status: 400,
        message: "Cannot update active status",
      });
    }
    res.status(200).json({
      status: 200,
      message: `Nurse's active status changed from ${!status} to ${status}`,
    });
  } catch (e) {
    res.status(500).json({
      status: 500,
      message: e.message,
    });
  }
};

module.exports = { toggleActiveStatus };
