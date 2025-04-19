const { Router } = require('express');
const routes = new Router();
const {
fetchEmployees,
createEmployee,
fetchEmployeeDeparments,
updateEmployee,
deleteEmployee
} = require('../controllers/employee.controller')


routes.get('/fetch', fetchEmployees);
routes.get('/fetchRoles', fetchEmployeeDeparments)
routes.post('/create', createEmployee);
routes.post('/update', updateEmployee);
routes.post('/delete', deleteEmployee);

module.exports = routes;
