const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('emp_list', {
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
    emp_status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 1,
      references: {
        model: 'emp_status_lookup',
        key: 'code'
      }
    },
    salary: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    join_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    phone_no: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employee_role_lookup',
        key: 'id'
      }
    }
  }, {
    tableName: 'emp_list',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "emp_list_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
