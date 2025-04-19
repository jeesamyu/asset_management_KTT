const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emp_status_lookup', {
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
    tableName: 'emp_status_lookup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "emp_status_lookup_pkey",
        unique: true,
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
};
