const express = require("express");
const { signUp, signIn } = require("../../controller/user_controller");
const api = express.Router();

//community based Api endpoints
api.post("/v1/community");
api.get("/v1/community");
api.get("/v1/community/:id/members");
api.get("/v1/community/me/owner");
api.get("/v1/community/me/member");

//Member based Api endpoints
api.post("/v1/member");
api.delete("/v1/member/:id");

//Role based Api endpoints
api.post("/v1/role");
api.get("/v1/role");

//user based Api endpoints
api.post("/v1/auth/signup", signUp);
api.post("/v1/auth/signin", signIn);
api.get("/v1/auth/me");

module.exports = api;
