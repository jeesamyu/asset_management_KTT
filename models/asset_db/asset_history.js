const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asset_history', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'emp_list',
        key: 'id'
      }
    },
    issued_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'emp_list',
        key: 'id'
      }
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'assets_list',
        key: 'id'
      }
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    tableName: 'asset_history',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asset_history_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
