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
const assetRoutes = require('./handlers/routes/assetMaster.route')
const assetCategoryRoutes = require('./handlers/routes/assetCategory.route')
const commonRoutes = require('./handlers/routes/helper.route')
const assetProvideRoutes = require('./handlers/routes/assetIssue.route')
const assetHistoryRoutes = require('./handlers/routes/assetHistory.route')
const assetScrapRoutes = require('./handlers/routes/assetScrap.route')

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

app.use('/assetProvide', assetProvideRoutes)
app.get('/issueAsset', (req, res) => {
    res.render('assetProvide');
})

app.use('/assetHistory', assetHistoryRoutes)
app.get('/assetHistory', (req, res) => {
    res.render('assetHistory');
})

app.get('/assetReturn', (req, res) => {
    res.render('assetReturn');
})

app.use('/assetScrap', assetScrapRoutes)
app.get('/assetScrap', (req, res) => {
    res.render('assetScrap');
})

app.use('/common', commonRoutes)

app.listen(4040, () => {
    console.log('SERVER WAS HOSTED ON http://localhost:4040 ')
})