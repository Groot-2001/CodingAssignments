const roleModel = require("../models/role");
const { authValidate } = require("../middleware/validate");

exports.Create = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await authValidate();

    //if name not found
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "INVALID_INPUT",
      });
    }

    //if there is name then we have to create the role
    let role_data = await roleModel.create({
      name,
    });

    //if all goes well
    return res.status(200).json({
      status: false,
      content: {
        data: role_data,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
