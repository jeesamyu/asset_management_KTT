
const express = require('express')
const path = require('path')

const app = express()

const dotenv = require('dotenv')
dotenv.config()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

const { myDatabase } = require('./plugins/database/db')

myDatabase.authenticate().then(() => {
    console.log('DATABASE CONNECTED SUCCESSFULLY!')
}).catch((error) => {
    console.error('FAILED TO CONNECT DATABASE! :', error)
})

const employeeRoutes = require('./handlers/routes/employee.route')

app.use('/employee', employeeRoutes)

app.get('/', (req, res) => {
    res.render('layouts/rootView');
});

app.get('/employees', (req, res) => {
    res.render('employee');
});

app.listen(4040, () => {
    console.log('SERVER WAS HOSTED ON http://localhost:4040 ')
})