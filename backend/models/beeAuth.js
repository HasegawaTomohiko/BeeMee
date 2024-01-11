const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('BeeMee','root','yourpassword',{
  host: 'beemee-mysql',
  dialect: 'mysql'
});

const BeeAuth = sequelize.define('BeeAuth', {
  beeId: { type: DataTypes.STRING(30),primaryKey: true },
  email: { type: DataTypes.STRING(100),allowNull: false },
  password: { type: DataTypes.STRING(100),allowNull: false }
},{
  timestamps: false,
  tableName: "BeeAuth"
});

module.exports = BeeAuth;
