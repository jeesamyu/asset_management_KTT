const {
    Sequelize
} = require('sequelize')

const {
    assets_list,
    asset_categories,
    asset_status_lookup
} = require('../../models/asset_db/init-models').initModels()

const fetchAssets = async (req, res) => {
    try {
        const {
            assetId,
            category,
            status
        } = req.query

        let where = {
        }

        if(assetId) {
            where.id = assetId
        }
        if(category) {
            where.asset_category_id = category
        }
        if(status) {
            where.status = status 
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
                [Sequelize.col('status_asset_status_lookup.label'), 'status_name']
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

        if(assetId) {
            let assetsList = await assets_list.findOne(configurations)
            return res.send(assetsList) 
        } else {
            let assetsList = await assets_list.findAll(configurations)
            return res.send(assetsList)
        }
        
    } catch (error) {
        console.log(error)
        return res.send({
            error: error.message
        })
    }
}

const createAsset = async (req, res) => {
    try {
        const {
            brand,
            model,
            serial_no,
            category_id,
            status_id,
            remark
        } = req.body

        await assets_list.create({
            brand,
            model,
            serial_no,
            category_id,
            status_id,
            remark
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
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('model')), 'model']]
          });

          const fetchBrandList = await assets_list.findAll({
            raw: true,
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']]
          });
          
        let brandList = fetchBrandList.map((item) => item.brand );
        let modelList = fetchModelList.map((item) => item.model );       

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