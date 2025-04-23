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

        let where = {
            status: {
                [Sequelize.Op.notIn]: [3, 4] // 3: obsolete, 4: deleted 
            }
        }

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
                'purchase_date'
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
            purchase_date: purchase_date ? new Date(purchase_date) : new Date(),
            status_id,
            remark
        })

        await asset_history.create({
            asset_id: createdAsset.id,
            remark: 'Asset purchased/Added to Inventory',
            issued_date: purchase_date ? new Date(purchase_date) : new Date()
        })

        return res.send('Asset created successfully!')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong while creating the asset.')
    }
}

const fetchAssetMasterDropdowns = async (req, res) => {
    try {
        const assetCategory = await asset_categories.findAll({
            raw: true,
            attributes: ['id', 'name']
        })

        let whereStatus = {}
        if (req.query && req.query.from && req.query.from === 'assetMaster') {
            whereStatus = {
                code: {
                    [Sequelize.Op.notIn]: [3, 4]
                }
            }
        }
        const assetStatus = await asset_status_lookup.findAll({
            raw: true,
            attributes: [
                ['code', 'id'], 'label'
            ],
            where: whereStatus
        })

        const fetchModelList = await assets_list.findAll({
            raw: true,
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']
            ],
            where: {
                status: {
                    [Sequelize.Op.notIn]: [3, 4]
                }
            }
        });

        const fetchBrandList = await assets_list.findAll({
            raw: true,
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
            ],
            where: {
                status: {
                    [Sequelize.Op.notIn]: [3, 4]
                }
            }
        });

        let brandList = fetchBrandList.map((item) => {
            return {
                label: item.brand,
                value: item.brand
            }
        });
        let modelList = fetchModelList.map((item) => {
            return {
                label: item.model,
                value: item.model
            }
        });

        return res.send({
            assetCategory,
            assetStatus,
            brandList,
            modelList
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong while fetching the asset master dropdowns.')
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
        
        const findAsset = await assets_list.findOne({
            raw: true,
            where: {
                id
            },
            attributes: ['id', 'status']
        })

        if (findAsset.status === 4) {
            return res.status(400).send('Asset no longer available!') 
        }

        if (findAsset.status === 3) {
            return res.status(400).send('Asset is obsolete!') 
        }

        if (findAsset.status === 2 && status_id === 1) {
            return res.status(400).send('Asset is assigned to a user!, please return the asset first!')    
        }

        await assets_list.update(updateData, {
            where: {
                id
            }
        })

        if (purchase_date) {
            await asset_history.update({
                issued_date: new Date(purchase_date)
            }, {
                where: {
                    asset_id: id,
                    user_id: null
                }
            })
        }

        return res.send('Asset updated successfully!')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong while updating the asset.')
    }
}

const deleteAssets = async (req, res) => {
    try {
        const {
            id
        } = req.body

        const findHistory = await asset_history.findOne({
            raw: true,
            where: {
                asset_id: id,
                user_id: null
            },
            attributes: ['id', 'remark']
        })

        if(findHistory){
            await asset_history.update({
               remark: findHistory.remark + ' | Asset was deleted from Inventory',
               returned_date: new Date()
            }, {
                where: {
                    id: findHistory.id 
                }
            })
        }

        await assets_list.update({
            status: 4 // deleted
        } ,{
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