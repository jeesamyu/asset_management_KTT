const { where, Sequelize } = require('sequelize');

const {
    asset_history,
    assets_list,
    asset_categories,
    emp_list
} = require('../../models/asset_db/init-models').initModels();

const fetchAssetHistory = async (req, res) => {
    try {
        const {
            asset_id,
            category_id,
            employee_id
        } = req.query;

        let whereClause = {};

        if (asset_id) {
            whereClause.asset_id = asset_id;
        }

        if (category_id) {
            whereClause = {
                ...whereClause,
                '$asset.category_id$' : category_id,
            }
        }

        if (employee_id) {
            whereClause = {
                ...whereClause,
                user_id: employee_id
            }
        }

        const assetHistory = await asset_history.findAll({
           raw: true, 
           where: whereClause,
           include: [
            {
                model: assets_list,
                as: 'asset',
                attributes: [],
                include: [
                    {
                        model: asset_categories,
                        as: 'category',
                        attributes: []
                    }
                ]
            },
            {
                model: emp_list,
                as: 'user',
                attributes: [] 
            }
           ],
           attributes: [
            [Sequelize.fn('MAX', Sequelize.col('asset_history.id')), 'id'],
            [Sequelize.fn('MAX', Sequelize.col('asset_history.remark')), 'remark'],
            [Sequelize.fn('MAX', Sequelize.col('asset_history.issued_date')), 'issued_date'],
            [Sequelize.fn('MAX', Sequelize.col('asset_history.returned_date')), 'returned_date'],
            [Sequelize.col('asset.brand'), 'brand'],
            [Sequelize.col('asset.model'), 'model'],
            [Sequelize.fn('MAX', Sequelize.col('asset.category.name')), 'category'], // Use an aggregate function
            [Sequelize.col('user.name'), 'employeeName']
       ],
           group: [
            'asset.id', 
            'user.id'
            ]
        })

        return res.send(assetHistory);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    fetchAssetHistory
}