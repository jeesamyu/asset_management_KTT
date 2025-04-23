const {
    Sequelize
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
            status: {
                [Sequelize.Op.notIn]: [3, 4] // 3- obosolete 4-deleted 
            }
        }

        if (type && type === 'all') {
            where = {}
        } else if (type && type === 'return') {
            where = {
                status: {
                    [Sequelize.Op.notIn]: [3, 4] // 3- obosolete 4-deleted
                }
            }
        }
        const assetList = await assets_list.findAll({
            raw: true,
            attributes: [
                'id',
                'brand',
                'model',
                [Sequelize.fn('COALESCE', Sequelize.col('category.name'), 'UNKNOWN'), 'category_name'],
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

const getAvailableAssets = async (req, res) => {
    try {
       const getAvailableAssets = await assets_list.findAll({
        raw: true,
        group: ['category_id', 'category.name'],
        attributes: [
            [Sequelize.fn('COALESCE', Sequelize.col('category.name'), 'UNKNOWN'), 'category_name'], // Use COALESCE to handle null category names
            [Sequelize.fn('COUNT', Sequelize.col('assets_list.id')), 'count']
        ],
        include: [{
            model: asset_categories,
            as: 'category',
            attributes: []
        }],
       })
       
       res.status(200).json(getAvailableAssets);
    } catch (error) {
        console.log(error);

        res.status(500).json('Internal Server Error'); 
    }
}

module.exports = {
    getEmployeeList,
    getAssetList,
    getAvailableAssets
}