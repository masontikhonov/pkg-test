const { Sequelize, DataTypes, Model } = require('sequelize');
const express = require('express');

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './database.sqlite',
});

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'users',
  }
);

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
  }
});

app.post('/users', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
    })
    res.status(200).json(user.toJSON());
  } catch (error) {
    console.error(error);
  }
});

const bootstrap = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ force: true });
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

bootstrap().catch(console.error);
