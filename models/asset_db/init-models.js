var DataTypes = require("sequelize").DataTypes;
var _asset_categories = require("./asset_categories");
var _asset_history = require("./asset_history");
var _asset_status_lookup = require("./asset_status_lookup");
var _assets_list = require("./assets_list");
var _emp_list = require("./emp_list");
var _emp_status_lookup = require("./emp_status_lookup");
var _employee_role_lookup = require("./employee_role_lookup");
var _history_status_lookup = require("./history_status_lookup");

function initModels() {
  var sequelize = require('../../plugins/database/db').myDatabase
  var asset_categories = _asset_categories(sequelize, DataTypes);
  var asset_history = _asset_history(sequelize, DataTypes);
  var asset_status_lookup = _asset_status_lookup(sequelize, DataTypes);
  var assets_list = _assets_list(sequelize, DataTypes);
  var emp_list = _emp_list(sequelize, DataTypes);
  var emp_status_lookup = _emp_status_lookup(sequelize, DataTypes);
  var employee_role_lookup = _employee_role_lookup(sequelize, DataTypes);
  var history_status_lookup = _history_status_lookup(sequelize, DataTypes);

  assets_list.belongsTo(asset_categories, { as: "category", foreignKey: "category_id"});
  asset_categories.hasMany(assets_list, { as: "assets_lists", foreignKey: "category_id"});
  assets_list.belongsTo(asset_status_lookup, { as: "status_asset_status_lookup", foreignKey: "status"});
  asset_status_lookup.hasMany(assets_list, { as: "assets_lists", foreignKey: "status"});
  asset_history.belongsTo(assets_list, { as: "asset", foreignKey: "asset_id"});
  assets_list.hasMany(asset_history, { as: "asset_histories", foreignKey: "asset_id"});
  asset_history.belongsTo(emp_list, { as: "user", foreignKey: "user_id"});
  emp_list.hasMany(asset_history, { as: "asset_histories", foreignKey: "user_id"});
  emp_list.belongsTo(emp_status_lookup, { as: "emp_status_emp_status_lookup", foreignKey: "emp_status"});
  emp_status_lookup.hasMany(emp_list, { as: "emp_lists", foreignKey: "emp_status"});
  emp_list.belongsTo(employee_role_lookup, { as: "role", foreignKey: "role_id"});
  employee_role_lookup.hasMany(emp_list, { as: "emp_lists", foreignKey: "role_id"});

  return {
    asset_categories,
    asset_history,
    asset_status_lookup,
    assets_list,
    emp_list,
    emp_status_lookup,
    employee_role_lookup,
    history_status_lookup,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
