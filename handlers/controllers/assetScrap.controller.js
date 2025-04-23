const {
    Sequelize
} = require('sequelize');
const {
    assets_list,
    asset_categories,
    asset_status_lookup,
    asset_history
} = require('../../models/asset_db/init-models').initModels()

const assetsToScrapList = async (req, res) => {
    try {
        const {
            category_id,
            status,
            serial_no,
            make,
            model
        } = req.query

        let where = {}

        if (category_id) {
            where.category_id = category_id
        }
        if (status) {
            where.status = status
        }
        if (serial_no) {
            where.serial_no = {
                [Sequelize.Op.like]: `%${serial_no}%`
            }
        }
        if (make) {
            where.brand = make
        }
        if (model) {
            where.model = model
        }

        const assets = await assets_list.findAll({
            raw: true,
            where: {
                '$assets_list.status$': {
                    [Sequelize.Op.notIn]: [3, 4] // 3- obosolete 4-deleted
                },
                ...where
            },
            attributes: [
                [Sequelize.col('assets_list.id'), 'id'],
                'brand',
                'model',
                [Sequelize.col('category.name'), 'category'],
                'serial_no',
                'obsolete_date',
                'remark',
                [Sequelize.col('status_asset_status_lookup.label'), 'status'],
                [Sequelize.col('assets_list.status'), 'rawStatus']
            ],
            include: [{
                    model: asset_categories,
                    as: 'category',
                    attributes: []
                },
                {
                    model: asset_status_lookup,
                    as: 'status_asset_status_lookup',
                    attributes: []
                }
            ]
        }) 

        return res.status(200).send(assets)
    } catch(error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
}

const moveAssetsToScrapList = async (req, res) => {
    try {
        const {
            id,
            obsoleteDate
        } = req.body;

        if (!id || !obsoleteDate) {
            return res.status(400).send('Asset ID and obsolete date are required');
        }

        const asset = await assets_list.findOne({
            raw: true,
            where: {
                id
            },
            attributes: [
               'id',
               'status' 
            ]
        })

        if (!asset) {
            return res.status(404).send('Asset not found'); 
        }

        if (asset.status === 3) {
            return res.status(400).send('Asset is already obsolete'); 
        }

        const findAssetHistory = await asset_history.findOne({
            raw: true,
            where: {
                user_id: {
                    [Sequelize.Op.ne]: null
                },
                asset_id: id,
                returned_date: null
            },
            attributes: [
                'id',
                'asset_id',
                'remark'
            ]
        })

        if (findAssetHistory) {
            return res.status(400).send('Asset is currently with an employee, Please mark the asset as returned first'); 
        }

        // check if asset is assigned to employee if yes then update the returned date in asset_histroy return date
        // again new history create with asset id returned date only add remark asset was scrapped

        await assets_list.update({
            status: 3, 
            obsolete_date: obsoleteDate
        }, {
            where: {
                id: id
            }
        });

        const assetPurchase = await asset_history.findOne({
            raw: true,
            where: {
                user_id: null,
                asset_id: id,
            },
            attributes: [
                'id',
                'remark'
            ]
        })

        await asset_history.update({
            returned_date: new Date(),
            remark: `${assetPurchase.remark} | Asset was scrapped` 
        }, {
            where: {
                id: assetPurchase.id
            }
        })

        return res.status(200).send('Asset marked as obsolete successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong');
    }
}

module.exports = {
    assetsToScrapList,
    moveAssetsToScrapList
}