const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('history_status_lookup', {
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
    tableName: 'history_status_lookup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "history_status_lookup_pkey",
        unique: true,
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
};
