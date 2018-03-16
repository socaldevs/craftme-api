const db = require('../../db/schema.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  //TODO: think about incorporating inner joins here
  saveLesson: async (req, res) => {
    try {
      let { teacher_id, student_id, chat_id, notes } = req.body;
      let lesson = await db.Lesson.create({
        teacher_id: teacher_id,
        student_id: student_id,
        chat_id: chat_id,
        notes: notes
      });
      res.send(lesson);
    } catch (error) {
      console.log('Error with saveLesson', error);
      return;
    }
  },

  fetchAllLessons: async (req, res) => {
    try {
      let id = req.params.id; //contingent upon passing
      let allLessons = await db.Lesson.findAll({
        where: {
          [Op.or]: [
            {
              student_id: id
            },
            {
              teacher_id: id
            }
          ]
        }
      });
      res.send(allLessons);
    } catch (error) {
      console.log('Error with fetchAllLessons', error);
      return;
    }
  },

  //TODO: returns the FEATURED crafts, needs to
  fetchFeaturedCrafts: (req, res) => {
    //possible MVP+
  },

  fetchAllTeachersForCraft: async (req, res) => {
    try {
      let { craft } = req.params;
      let teachers = await db.User.findAll({
        where: {
          crafts: {
            [Op.contains]: [craft]
          },
          [Op.and]: [{ type: 2 }]
        }
      });
      res.send(teachers);
    } catch (error) {
      console.log(error);
      return;
    }
  }
};