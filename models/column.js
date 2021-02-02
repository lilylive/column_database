'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Column = loader.database.define('columns', {
  columnId: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  columnName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  columnAuthor: {
    type: Sequelize.STRING,
    allowNull: false
  },
  memo: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  adminCheck: {
    type: Sequelize.STRING,
    allowNull: false
  }

}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  });

module.exports = Column;