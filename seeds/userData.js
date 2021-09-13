const { User } = require('../models');

const userData =[
    {
      "username": "Sal",
      "password": "pass1"
    }, {
      "username": "Lernantino",
      "password": "pass2"
    }, {
      "username": "Amiko",
      "password": "pass3"
    }
  ];

  const seedUser = () => User.bulkCreate(userData);

  module.exports = seedUser;
  