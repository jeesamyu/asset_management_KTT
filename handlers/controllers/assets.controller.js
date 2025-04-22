const {
    Sequelize
} = require('sequelize')

const {
    assets_list,
    asset_categories,
    asset_status_lookup,
    asset_history
} = require('../../models/asset_db/init-models').initModels()

const fetchAssets = async (req, res) => {
    try {
        const {
            assetId,
            category_id,
            status,
            serial_no,
            make,
            model
        } = req.query

        let where = {}

        if (assetId) {
            where.id = assetId
        }
        if (category_id) {
            where.category_id = category_id
        }
        if (status) {
            where.status = status
        }
        if (serial_no) {
            where.serial_no = serial_no
        }
        if (make) {
            where.brand = make
        }
        if (model) {
            where.model = model
        }

        const configurations = {
            raw: true,
            where,
            attributes: [
                'id',
                'brand',
                'model',
                'serial_no',
                'category_id',
                [Sequelize.col('assets_list.status'), 'asset_status_id'],
                'remark',
                [Sequelize.col('category.name'), 'category_name'],
                [Sequelize.col('status_asset_status_lookup.label'), 'status_name'],
                [Sequelize.literal(`COALESCE(TO_CHAR(purchase_date, 'YYYY-MM-DD'), 'N/A')`), 'purchase_date']
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
        }

        if (assetId) {
            let assetsList = await assets_list.findOne(configurations)
            return res.send(assetsList)
        } else {
            let assetsList = await assets_list.findAll(configurations)
            return res.send(assetsList)
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send('There was an error while fetching the assets list.')
    }
}

const createAsset = async (req, res) => {
    try {
        const {
            brand,
            model,
            serial_no,
            category_id,
            purchase_date,
            status_id,
            remark
        } = req.body

        const createdAsset = await assets_list.create({
            brand,
            model,
            serial_no,
            category_id,
            purchase_date: purchase_date ? new Date(purchase_date) : null,
            status_id,
            remark
        })

        await asset_history.create({
            asset_id: createdAsset.id,
            remark: 'Asset purchased/Added to Inventory'
        })

        return res.send({
            message: 'Asset created successfully!'
        })
    } catch (error) {
        console.log(error)
        return res.send({
            error: error.message
        })
    }
}

const fetchAssetMasterDropdowns = async (req, res) => {
    try {
        const assetCategory = await asset_categories.findAll({
            raw: true,
            attributes: ['id', 'name']
        })

        const assetStatus = await asset_status_lookup.findAll({
            raw: true,
            attributes: [
                ['code', 'id'], 'label'
            ]
        })

        const fetchModelList = await assets_list.findAll({
            raw: true,
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']
            ]
        });

        const fetchBrandList = await assets_list.findAll({
            raw: true,
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
            ]
        });

        let brandList = fetchBrandList.map((item) => item.brand);
        let modelList = fetchModelList.map((item) => item.model);

        return res.send({
            assetCategory,
            assetStatus,
            brandList,
            modelList
        })
    } catch (error) {
        console.log(error)
        return res.send({
            error: error.message
        })
    }
}

const updateAssets = async (req, res) => {
    try {
        const {
            id,
            brand,
            model,
            serial_no,
            category_id,
            purchase_date,
            status_id,
            remark
        } = req.body

        let updateData = {}

        if (brand) {
            updateData.brand = brand
        }
        if (model) {
            updateData.model = model
        }
        if (serial_no) {
            updateData.serial_no = serial_no
        }
        if (category_id) {
            updateData.category_id = category_id
        }
        if (status_id) {
            updateData.status = status_id
        }
        if (remark) {
            updateData.remark = remark
        }
        if (purchase_date) {
            updateData.purchase_date = new Date(purchase_date)
        }

        await assets_list.update(updateData, {
            where: {
                id
            }
        })

        return res.send({
            message: 'Asset updated successfully!'
        })
    } catch (error) {
        console.log(error)
        return res.send({
            error: error.message
        })
    }
}

const deleteAssets = async (req, res) => {
    try {
        const {
            id
        } = req.body

        await assets_list.destroy({
            where: {
                id
            }
        })

        return res.send({
            message: 'Asset deleted successfully!'
        })
    } catch (error) {
        console.log(error)
        return res.send({
            error: error.message
        })
    }
}

module.exports = {
    fetchAssets,
    createAsset,
    fetchAssetMasterDropdowns,
    updateAssets,
    deleteAssets
}