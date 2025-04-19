const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('asset_status_lookup', {
    code: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'asset_status_lookup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "asset_status_lookup_pkey",
        unique: true,
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
};
