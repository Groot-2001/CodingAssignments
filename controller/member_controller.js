const Member = require("../models/member");
const Role = require("../models/role");
const Community = require("../models/community");
const User = require("../models/user");
const { makeMember } = require("../middleware/validate");

exports.addMember = async (req, res) => {
  try {
    //sanitize the input data
    let result = await makeMember.validateAsync(req.body);

    let userExists = await User.findOne({
      id: result.user,
    });

    let communityExists = await Community.findOne({
      id: result.community,
    });

    let roleExists = await Role.findOne({
      id: result.role,
    });

    let memberExists = await Member.findOne({
      community: result.community,
      user: result.user,
      role: result.role,
    });

    //we need to findout the current user is admin or not
    let currentUser = await User.findOne({ email: req.user.email });

    //check whether the userExists or not
    if (!userExists || !currentUser) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    //check whether the communityExists or not
    if (!communityExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    //check whether the roleExists or not
    if (!roleExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
    //check whether the memberExists or not
    if (memberExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      });
    }

    //we need to fetch current users details
    let currentUserCommunity = await Member.findOne({
      user: currentUser.id,
    });

    //we need to fetch role information about the current user
    let currentUserRole = await Role.findOne({ id: currentUserCommunity.role });

    if (currentUserRole.name === "Community Admin") {
      let newMember = await Member.create({
        community: result.community,
        user: result.user,
        role: result.role,
      });

      console.log("saved", newMember);

      const { _id, ...responseMember } = newMember._doc;

      return res.status(200).json({
        status: true,
        data: responseMember,
      });
    } else {
      return res.status(400).json({
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    // const result = removeMemeber.validateAsync(req.params);
    const { id } = req.params;
    //finding the current user with id
    let currentUser = await Member.findOne({ user: req.user.id });

    //finding the current user's role with role_id
    let currentUserRole = await Role.findOne({ id: currentUser.role });

    //Only Community Admin and Community Moderator can remove user.
    if (
      currentUserRole.name === "Community Admin" ||
      currentUserRole.name === "Community Moderator"
    ) {
      console.log(id);
      //find the member and delte member
      await Member.findOneAndDelete({ id });

      //if all goes well
      return res.status(200).json({
        status: true,
      });
    } else {
      return res.status(200).json({
        status: false,
        errors: [
          {
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server Error",
    });
  }
};
