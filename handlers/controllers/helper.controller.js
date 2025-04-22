const {
    Sequelize,
    where
} = require('sequelize');

const {
    emp_list,
    assets_list,
    asset_categories
} = require('../../models/asset_db/init-models').initModels();

const getEmployeeList = async (req, res) => {
    try {
        const employeeList = await emp_list.findAll({
            raw: true,
            attributes: [
                ['id', 'emp_id'],
                ['name', 'emp_name']
            ]
        });

        res.status(200).json(employeeList);
    } catch (error) {
        console.log(error);
        res.status(500).json('Internal Server Error');
    }
}

const getAssetList = async (req, res) => {
    try {
        const {
            type
        } = req.query;

        let where = {
            status: 1
        }

        if (type && type === 'all') {
            where = {}
        }
        const assetList = await assets_list.findAll({
            raw: true,
            attributes: [
                'id',
                'brand',
                'model',
                [Sequelize.col('category.name'), 'category_name'],
            ],
            where,
            include: [{
                model: asset_categories,
                as: 'category',
                attributes: []
            }]
        });

        const options = assetList.map(asset => {
            return {
                value: asset.id,
                label: `${asset.brand} - ${asset.model} - ${asset.category_name}`
            }
        })

        res.status(200).json(options);
    } catch (error) {
        console.log(error);

        res.status(500).json('Internal Server Error');
    }
}

module.exports = {
    getEmployeeList,
    getAssetList
}