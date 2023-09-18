const express = require("express");
const { CreateRole, getRole } = require("../../controller/role_controller");
const {
  createCommunity,
  getAllCommunity,
  getAllMembers,
  getMyOwnedCommunity,
  getMyJoinedCommunity,
} = require("../../controller/community_controller");
const { signUp, signIn, getMe } = require("../../controller/user_controller");
const {
  deleteMember,
  addMember,
} = require("../../controller/member_controller");
const userAuthenticate = require("../../middleware/user_authentication");
const api = express.Router();

//user based Api endpoints
api.post("/v1/auth/signup", signUp);
api.post("/v1/auth/signin", signIn);
api.get("/v1/auth/me", userAuthenticate, getMe);

//community based Api endpoints
api.post("/v1/community", userAuthenticate, createCommunity);
api.get("/v1/community", getAllCommunity);
api.get("/v1/community/:id/members", getAllMembers);
api.get("/v1/community/me/owner", userAuthenticate, getMyOwnedCommunity);
api.get("/v1/community/me/member", userAuthenticate, getMyJoinedCommunity);

//Role based Api endpoints
api.post("/v1/role", CreateRole);
api.get("/v1/role", getRole);

//Member based Api endpoints
api.post("/v1/member", userAuthenticate, addMember);
api.delete("/v1/member/:id", userAuthenticate, deleteMember);

module.exports = api;
