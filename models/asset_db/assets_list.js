const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('assets_list', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serial_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: "assets_list_serial_no_key"
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'asset_categories',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
      references: {
        model: 'asset_status_lookup',
        key: 'code'
      }
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'assets_list',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "assets_list_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "assets_list_serial_no_key",
        unique: true,
        fields: [
          { name: "serial_no" },
        ]
      },
    ]
  });
};
