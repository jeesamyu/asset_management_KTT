const {
    asset_categories
} = require('../../models/asset_db/init-models').initModels()
const {
    Sequelize
} = require('sequelize')

const fetchAssetCategories = async (req, res) => {
    try {
        const {
            id,
            name
        } = req.query
        let where = {}

        if (id) {
            where.id = id
        }
        if (name) {
            where.name = {
                [Sequelize.Op.like]: `%${name}%`
            }
        }

        let assetCategories = []
        if (id) {
            assetCategories = await asset_categories.findOne({
                raw: true,
                attributes: [
                    'id',
                    'name',
                    'remark'
                ],
                where
            })
        } else {
            assetCategories = await asset_categories.findAll({
                raw: true,
                attributes: [
                    'id',
                    'name',
                    'remark'
                ],
                where
            })
        }
        return res.send(assetCategories)
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
}

const createAssetCategory = async (req, res) => {
    const {
        name,
        remark
    } = req.body
    try {

        const existingAssetCategory = await asset_categories.findOne({
            raw: true,
            where: {
                name
            },
            attributes: ['id']
        })

        if (existingAssetCategory) {
            return res.status(400).send('Asset category already exists')
        }

        await asset_categories.create({
            name,
            remark
        })

        return res.send('Asset category created successfully')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
}

const deleteAssetCategory = async (req, res) => {
    const {
        id
    } = req.body
    try {
        await asset_categories.destroy({
            where: {
                id
            }
        })

        return res.send('Asset category deleted successfully')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
}

const updateAssetCategory = async (req, res) => {
    const {
        id,
        name,
        remark
    } = req.body
    try {
        const updateData = {}

        if (name) {
            updateData.name = name;

            const findAssetCategory = await asset_categories.findOne({
                raw: true,
                where: {
                    name,
                    id: { [Sequelize.Op.ne]: id }
                },
                attributes: ['id', 'name']
            });

            if (findAssetCategory) {
                return res.status(400).send('Asset category already exists');
            }
        }

        if (remark) {
            updateData.remark = remark;
        }

        await asset_categories.update(updateData, {
            where: {
                id
            }
        });

        return res.send('Asset category updated successfully');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Something went wrong');
    }
}

module.exports = {
    fetchAssetCategories,
    createAssetCategory,
    deleteAssetCategory,
    updateAssetCategory
}