const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asset_categories', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "unique_asset_category_name"
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'asset_categories',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asset_categories_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_asset_category_name",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
