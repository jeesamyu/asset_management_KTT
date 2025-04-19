const { Sequelize } = require('sequelize')

const { emp_list, employee_role_lookup, emp_status_lookup } = require('../../models/asset_db/init-models').initModels()

const fetchEmployees = async (req, res) => {
    let employees = []
    try {

        const { empId, department, status } = req.query

        let where = {    
        }

        if(empId){
            where.id = empId
        }
        if(department){
            where.role_id = department 
        }
        if(status){
            where.emp_status = status
        }

        let configurations = {
            raw: true,
            nest: true,
            where,
            attributes: [
                ['id', 'empId'],
                'name',
                ['phone_no', 'phone'],
                'email',
                'address',
                'salary',
                ['join_date', 'hireDate'],
                [Sequelize.col('emp_status_emp_status_lookup.label'), 'employeeStatus'],
                [Sequelize.col('role.role_name'), 'department'],
                [Sequelize.col('role.id'), 'departmentId'],
                [Sequelize.col('emp_status_emp_status_lookup.code'), 'employeeStatusCode']
            ],
            include: [
                {
                    model: employee_role_lookup,
                    as: 'role',
                    attributes: [
                    ]
                },
                {
                    model: emp_status_lookup,
                    as: 'emp_status_emp_status_lookup',
                    attributes: [
                    ]
                }
            ],
            order: [
                ['created_at', 'DESC']
            ]
        }
        
        let findEmpoyees = []
        if(empId){
            findEmpoyees = await emp_list.findOne(configurations)
        } else {
            findEmpoyees = await emp_list.findAll(configurations)
        }

        employees = findEmpoyees
    } catch (error) {
        console.log(error)
    }

    return res.send(employees)
}

const fetchEmployeeDeparments = async (req, res) => {
    try {
        const fetchRoles = await employee_role_lookup.findAll({
            raw: true,
            attributes: [
                'id',
                'role_name'
            ]
        })

        const fetchEmployeeStatus = await emp_status_lookup.findAll({
            raw: true,
            attributes: [
                'code',
                'label'
            ]
        })

        return res.send({ roles: fetchRoles, employeeStatus: fetchEmployeeStatus })
    } catch (error) {
        console.log(error)
        return res.send('employee', { roles: [], message: error.message })
    }
}

const createEmployee = async (req, res) => {
    const { name, department, phone, email, address, salary, hireDate, employeeStatus } = req.body

    try {
        await emp_list.create({
            name,
            role_id: department,
            phone_no: phone,
            email,
            address,
            salary,
            join_date: hireDate,
            emp_status: employeeStatus
        })

        return res.send('Employee created successfully')
    } catch (error) {
        console.log(error)
        return res.send('Something went wrong')
    }
}

const deleteEmployee = async (req, res) => {
    const { id } = req.body
    try {
        await emp_list.destroy({
            where: {
                id
            }
        })   

        return res.send('Employee deleted successfully')
    } catch (error) {
        console.log(error)
        return res.send('Something went wrong')
    }
}

const updateEmployee = async (req, res) => {
    const { id, name, department, phone, email, address, salary, hireDate, employeeStatus } = req.body 
    try {
        await emp_list.update({
            name,
            role_id: department,
            phone_no: phone,
            email,
            address,
            salary,
            join_date: hireDate,
            emp_status: employeeStatus 
        }, {
            where: {
                id
            }
        }) 
    }catch (error) {
        console.log(error)
        return res.send('Something went wrong')
    }

    return res.send('Employee updated successfully')
}

module.exports = {
    fetchEmployees,
    createEmployee,
    fetchEmployeeDeparments,
    deleteEmployee,
    updateEmployee
}