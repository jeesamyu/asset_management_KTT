const express = require('express')
const path = require('path')

const app = express()

const dotenv = require('dotenv')
dotenv.config()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(path.join(__dirname, 'public')))

const {
    myDatabase
} = require('./plugins/database/db')

myDatabase.authenticate().then(() => {
    console.log('DATABASE CONNECTED SUCCESSFULLY!')
}).catch((error) => {
    console.error('FAILED TO CONNECT DATABASE! :', error)
})

const employeeRoutes = require('./handlers/routes/employee.route')
const assetRoutes = require('./handlers/routes/assets.route')
const assetCategoryRoutes = require('./handlers/routes/assetCategory.route')

app.get('/', (req, res) => {
    res.render('layouts/rootView');
});

app.use('/employee', employeeRoutes)
app.get('/employees', (req, res) => {
    res.render('employee');
});

app.use('/assets', assetRoutes)
app.get('/assets', (req, res) => {
    res.render('assetMaster');
})

app.use('/assetCategory', assetCategoryRoutes)
app.get('/categories', (req, res) => {
    res.render('assetCategory');
})

app.get('/issueAsset', (req, res) => {
    res.render('assetProvide');
})

app.listen(4040, () => {
    console.log('SERVER WAS HOSTED ON http://localhost:4040 ')
})