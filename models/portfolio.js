'use strict';

const contants = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const InvestorPortfolio = sequelize.define('InvestorPortfolio', {
    totalInvested: DataTypes.FLOAT,
    totalWithdraw: DataTypes.FLOAT,
    ownershipPercentage: DataTypes.FLOAT,
    currentWeitage: DataTypes.FLOAT,
    operatingIncome: DataTypes.FLOAT,
    cashAvailableToWithdrawal: DataTypes.FLOAT,
    updateReason: {
      type: DataTypes.STRING,
      isIn: contants.PORTFOLIO_UPDATE_REASON
    },
  }, {});
  InvestorPortfolio.associate = function (models) {
    // associations can be defined here
    InvestorPortfolio.belongsTo(models.Investor, { foreignKey: 'userId' });
  };
  return InvestorPortfolio;
};


// const updateInvestorPercentage = function () {
//   //Investment come (consider accrued interest)
//   //Investor withdraw 
//   //loan recovery
//   let recoveryAmount = 100

//   // Distribute share
//   models.Investor.findAll({}).then(investors => {
//     for (investor in investors)
//       recoveryAmount * (investor.ownershipPercentage / 100)

//       investor 
//     res.status(200).json({ installments: installments });
//   }).catch(error => {
//     res.status(500).json({ message: error.message });
//   })


// }