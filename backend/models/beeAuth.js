
const { Sequelize, DataTypes} = require('requelize');
const sequelize = new Sequelize('BeeMee','root','yourpassword',{
  host: 'beemee-mysql',
  dialect: 'mysql'
});

const BeeAuth = sequelize.define('BeeAuth', {
  beeID: {
    type: DataTypes.STRING(30),
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  salt: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
},{});

module.exports = BeeAuth;
