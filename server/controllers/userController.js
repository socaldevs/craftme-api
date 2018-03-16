const db = require('../../db/schema.js');
const sequelize = require('sequelize');

module.exports = {
  fetchUserInfo: async (req, res) => {
    try {
      let id = req.params.id;
      let userInfo = await db.User.findOne({
        where: { id: id }
      });
      res.send(userInfo);
    } catch (error) {
      console.log('Error with fetchUserInfo', error);
      return;
    }
  },

  addTeacherOrStudent: async (req, res) => {
    try {
      let { username, type, bio, profile_pic_url, crafts, rating } = req.body;
      let newUser = await db.User.create({
        username: username,
        type: type,
        bio: bio,
        profile_pic_url: profile_pic_url,
        crafts: crafts,
        rating: rating
      });
      //TODO don't need res.send data...only for testing purposes
      res.send(newUser);
    } catch (error) {
      console.log('Error with addTeacherOrStudent', error);
      return;
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      let { id, profile_pic_url, crafts, bio } = req.body;
      let user = await db.User.findOne({ where: { id: id } });
      user.update({
        profile_pic_url: profile_pic_url,
        crafts: crafts,
        bio: bio
      });
      res.send(user);
    } catch (error) {
      console.log('Error with updateUserInfo', error);
      return;
    }
  }
};