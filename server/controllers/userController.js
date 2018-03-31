const db = require('../../db/schema.js');
const sequelize = require('sequelize');
const { languageTranslator } = require('../languageTranslator.js');


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
      //add ---->       crafts, rating
      let { username, type, bio, profile_pic, crafts, rating} = req.body;
      //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
      let newUser = await db.User.create({
        username: username,
        type: type,
        bio: bio,
        profile_pic_url: profile_pic,
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
  },

  fetchUsernameById: async id => {
    try {
      let username = await db.User.findOne({ where: { id: id } });
      return username.username;
    } catch (error) {
      console.log('Error with fetchUsernameById', error);
      return;
    }
  },

  getIdByUsername: async (req, res) => {
    try {
      const { username } = req.params;
      const id = await db.User.findOne({ where: { username } });
      res.status(201).send(id);
    } catch (error) {
      console.log('Error with getIdByUsername', error);
      return;
    }
  },
  getAllCrafts: async (req, res) => {
    try {
      const crafts = await db.Craft.findAll({});
      res.status(200).send(crafts);
    } catch (error) {
      console.log('Error with getIdByUsername', error);
      return;
    }
  },
  getCraftTeachers: async (req, res) => {
    try {
      const { craftId } = req.params;
      const teachers = await db.Craft.findAll({
        where: {
          id:craftId
        },
        include: [{
            model: db.User,
            // as: 'userId'  
          }]  
      });
       res.status(200).send(teachers);
    } catch (error) {
      console.log('Error with getCraftTeachers', error);
      return;
    }
  },

  getTranslation: (req, res) => {
    const { text, translateFrom, translateTo } = req.body;
    const parameters = {
      text,
      model_id: `${translateFrom}-${translateTo}`,
    };
    languageTranslator.translate(
      parameters,
      (error, response) => {
        if (error)
          console.log(error)
        else
          res.send(JSON.stringify(JSON.stringify(response.translations[0].translation, null, 2)));
      }
    );
  },

  getLanguageList: (req, res) => {
    languageTranslator.listIdentifiableLanguages(
      {},
      (err, response) => {
        if (err)
          console.log(err)
        else
          res.send(JSON.stringify(response.languages, null, 2));
      }
    );
  },

  // getAllTeachers: async () => {
  //   try {
  //     const teachers = await db.User.findAll({
  //       where: {
  //         type: 0
  //       }
  //     })
  //     return teachers;
  //   } catch (error) {
  //     console.log('Error with getAllTeachers', error);
  //     return;
  //   }
  // },
  
};
