const validateInput = (res, requiredFields) => {
  const missingFields = Object.entries(requiredFields)
    .filter(
      ([_, value]) => value === undefined || value === null || value === ""
    )
    .map(([key]) => key);

  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: "Missing Fields",
      missingFields,
    });
    return false;
  }

  return true;
};

module.exports = validateInput;
