const User = require("../models/user");
const Community = require("../models/community");
const Role = require("../models/role");
const Member = require("../models/member");
const { makeCommunity } = require("../middleware/validate");

exports.createCommunity = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user) {
      //sanitize the request body using joi validation
      const result = await makeCommunity.validateAsync(req.body);

      //get the current user
      const currentUser = await User.findOne({ email: req.user.email });

      //creating the role as community admin
      let role_data = await Role.create({
        name: "Community Admin",
      });

      //creating the new community
      const newCommunity = new Community({
        name: result.name,
        slug: result.name,
        owner: currentUser,
      });

      //save the user
      const savedCommunity = await newCommunity.save();

      //current user will be the first member of a community
      await Member.create({
        community: newCommunity,
        user: currentUser,
        role: role_data,
      });

      //exclude unneccessary before populating the data
      const { _id, ...responseUser } = savedCommunity._doc;

      //if all goes well then
      return res.status(200).json({
        status: true,
        content: {
          data: responseUser,
        },
      });
    } else {
      return res.status(401).json({
        status: false,
        errors: [
          {
            message: "You need to sign in to proceed.",
            code: "NOT_SIGNEDIN",
          },
        ],
      });
    }
  } catch (error) {
    console.log(error);

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

    //if the error is not related to user
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllCommunity = async (req, res) => {
  try {
    let limit = 10;
    let page = 1;

    let community = await Community.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate({
        path: "owner",
        model: "user_model",
        select: "-_id -createdAt -updatedAt -email -password", // Exclude the field you want to exclude
      })
      .exec();

    let totalPage = await Community.countDocuments();

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalPage,
          pages: Math.ceil(totalPage / limit),
          page: page,
        },
        data: community,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllMembers = async (req, res) => {
  try {
    let limit = 10;
    let page = 1;

    const { id } = req.params;

    let community_data = await Community.findOne({ name: id });

    let members = await Member.find({ community: community_data._id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate({
        path: "user",
        model: "user_model",
        select: "-_id -createdAt -updatedAt -email -password", // Exclude the field you want to exclude
      })
      .populate({
        path: "role",
        model: "role_model",
        select: "-_id -createdAt -updatedAt -scopes", // Exclude the field you want to exclude
      })
      .select("-_id")
      .exec();

    let totalPage = await Member.countDocuments();

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalPage,
          pages: Math.ceil(totalPage / limit),
          page: page,
        },
        data: members,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getMyOwnedCommunity = async (req, res) => {
  try {
    let limit = 10;
    let page = 1;

    //get the currently signed in user

    let currentUser = await User.findOne({ email: req.user.email });

    let community_data = await Community.find({ owner: currentUser._id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-_id")
      .exec();

    let totalPage = community_data.length;

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalPage,
          pages: Math.ceil(totalPage / limit),
          page: page,
        },
        data: community_data,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getMyJoinedCommunity = async (req, res) => {
  try {
    let limit = 10;
    let page = 1;

    //get the currently signed in user
    let currentUser = await User.findOne({ email: req.user.email });

    //let say the user can be member of another community
    let member_data = await Member.find({ user: currentUser._id });

    let community_data;

    for (const obj of member_data) {
      const communityID = obj.community;

      // Perform a query to find the community by name or ID
      community_data = await Community.find({ _id: communityID })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate({
          path: "owner",
          model: "user_model",
          select: "-_id -createdAt -updatedAt -email -password",
        })
        .exec();
    }

    let totalPage = community_data.length;

    return res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalPage,
          pages: Math.ceil(totalPage / limit),
          page: page,
        },
        data: community_data,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
