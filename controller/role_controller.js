const roleModel = require("../models/role");
const { makeRole } = require("../middleware/validate");

exports.CreateRole = async (req, res) => {
  try {
    const result = await makeRole.validateAsync(req.body);

    //if there is name then we have to create the role
    let role_data = await roleModel.create({
      name: result.name,
    });

    console.log(role_data);
    //exclude unneccessary before populating the data
    const { scopes, _id, ...responseUser } = role_data._doc;

    //if all goes well
    return res.status(200).json({
      status: true,
      content: {
        data: responseUser,
      },
    });
  } catch (error) {
    console.error(error);
    //if joi throws any input validation errors
    if (!error.errors) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: error.details[0].path[0],
            message: error.details[0].message,
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    return res.status(500).json("Internal Server Error");
  }
};

exports.getRole = async (req, res) => {
  try {
    let limit = 10;
    let page = 1;
    //if there is name then we have to create the role
    let role_data = await roleModel
      .find({}, { _id: 0, id: 1, name: 1, createdAt: 1, updatedAt: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    let totalPage = await roleModel.countDocuments();

    //if all goes well
    return res.status(200).json({
      status: false,
      content: {
        meta: {
          total: totalPage,
          pages: Math.ceil(totalPage / limit),
          page: page,
        },
        data: role_data,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
};
