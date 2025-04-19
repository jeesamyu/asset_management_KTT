const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employee_role_lookup', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'employee_role_lookup',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "employee_role_lookup_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
