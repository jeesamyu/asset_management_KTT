const {
    Sequelize,
    Op
} = require('sequelize')

const {
    assets_list,
    emp_list,
    asset_categories,
    asset_history
} = require('../../models/asset_db/init-models').initModels()

const assignAssetToEmployee = async (req, res) => {
    try {
        const {
            asset_id,
            employee_id,
            issued_date,
            remark
        } = req.body

        const findAsset = await assets_list.findOne({
            raw: true,
            where: {
                id: asset_id,
                status: 1
            },
            attributes: ['id']
        })

        if (!findAsset) {
            return res.status(400).send('Asset not available!')
        }

        const findIfAnyUserHave = await asset_history.findAll({
            raw: true,
            where: {
                asset_id,
                user_id: {
                    [Op.not]: null
                },
                returned_date: {
                    [Sequelize.Op.is]: null
                }
            },
            attributes: ['id']
        })

        if (findIfAnyUserHave && findIfAnyUserHave.length > 0) {
            return res.status(400).send('Asset already issued to another employee')
        }

        const findEmployee = await emp_list.findOne({
            raw: true,
            where: {
                id: employee_id
            },
            attributes: ['id']
        })

        if (!findEmployee) {
            return res.status(400).send('Employee not found')
        }

        await asset_history.create({
            user_id: employee_id,
            asset_id,
            issued_date,
            remark: remark ? `${remark} - Asset Issued` : 'Asset Issued'
        })

        await assets_list.update({
            status: 2 // unavailable
        }, {
            where: {
                id: asset_id
            }
        })

        return res.send('Asset Issued Successfully')
    } catch (error) {
        console.log(error)
        return res.status(500).send('Internal server error')
    }
}

const issuedAssetHistoryFetch = async (req, res) => {
    try {
        const {
            id,
            employee_id,
            asset_id,
            category_id
        } = req.query

        let whereCondition = {
            returned_date: {
                [Sequelize.Op.is]: null
            }
        }

        if(id) {
            whereCondition = {
                id: id
            }
        }

        if(employee_id) {
            whereCondition = {
                ...whereCondition,
                user_id: employee_id
            }
        }

        if(asset_id) {
            whereCondition = {
                ...whereCondition,
                asset_id
            }
        }

        if(category_id) {
            whereCondition = {
               ...whereCondition,
                '$asset.category_id$': category_id
            } 
        }
        
        let configuration =  {
            raw: true,
            attributes: [
                'id',
                [Sequelize.col('user.name'), 'employeeName'],
                'user_id',
                'asset_id',
                'remark',
                [Sequelize.col('asset.brand'), 'brand'],
                [Sequelize.col('asset.model'), 'model'],
                [Sequelize.col('asset.category.name'), 'category_name'],
                'issued_date',
            ],
            where: whereCondition,
            include: [{
                    model: assets_list,
                    as: 'asset',
                    required: true,
                    attributes: [],
                    include: [{
                        model: asset_categories,
                        as: 'category',
                        attributes: []
                    }]
                },
                {
                    model: emp_list,
                    as: 'user',
                    required: true,
                    attributes: []
                }
            ]
        }

        let issuedAssets = []

        if(id) {
            issuedAssets = await asset_history.findOne(configuration);
        } else {
            issuedAssets = await asset_history.findAll(configuration);
        }

        return res.json(issuedAssets);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
}

const updateProviedAsset = async (req, res) => {
    try {
        const {
            id,
            asset_id,
            employee_id,
            issued_date,
            remark
        } = req.body 

        const findAsset = await asset_history.findOne({
            raw: true,
            where: {
                id,
                user_id: {
                    [Op.and] : [
                        {
                            [Op.not]: null
                        },
                        {
                            [Op.ne]: employee_id
                        }
                    ] 
                },
                returned_date: {
                    [Sequelize.Op.is]: null
                }
            }, 
            attributes: ['id', 'remark', 'asset_id']
        })

        if (findAsset) {
            return res.status(400).send('Asset already issued to another employee, please take return first')
        }

        if(asset_id) {
            const findAsset = await assets_list.findOne({
                raw: true,
                where: {
                    id: asset_id,
                    status: 1
                },
                attributes: ['id']
            })

            if (!findAsset) {
                return res.status(400).send('Asset not available!')
            }
        }

        if(employee_id) {
            const findEmployee = await emp_list.findOne({
                raw: true,
                where: {
                    id: employee_id
                },
                attributes: ['id']
            })

            if (!findEmployee) {
                return res.status(400).send('Employee not found')
            }
        }

        if(asset_id !== findAsset.asset_id) {
            await assets_list.update({
                status: 1 // available
            }, {
                where: {
                    id: findAsset.asset_id
                }
            })
        }

        await asset_history.update({
            user_id: employee_id,
            asset_id,
            issued_date,
            remark: remark ? `${findAsset.remark} | ${remark} - Asset Updated` : `${findAsset.remark} | Asset Updated` 
        }, {
            where: {
                id 
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
}

const issuedAssetReturnedByEmployee = async (req, res) => {
    try {
        const {
            id,
            returnDate,
            returnRemark
        } = req.body

        const findAsset = await asset_history.findOne({
            raw: true,
            where: {
                id,
                returned_date: {
                    [Sequelize.Op.is]: null
                }
            },
            attributes: ['id', 'remark', 'asset_id']
        })

        if (!findAsset) {
            return res.status(400).send('Asset not issued to any employee')
        }

        await asset_history.update({
            returned_date: returnDate,
            remark: returnRemark ? `${findAsset.remark} | ${returnRemark} - Asset Returned` : `${findAsset.remark} | Asset Returned`
        }, {
            where: {
                id: findAsset.id
            }
        })

        await assets_list.update({
            status: 1 // available 
        }, {
            where: {
                id: findAsset.asset_id
            }
        })

        return res.send('Asset Returned Successfully')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    }
}

const deleteAssignedAsset = async (req, res) => {
    try {
        const {
            id,
            remark 
        }  = req.body

        const findAsset = await asset_history.findOne({
            raw: true,
            where: {
                id,
                returned_date: {
                    [Sequelize.Op.is]: null
                }
            },
            attributes: ['id','remark', 'asset_id']
        })


        if (!findAsset) {
            return res.status(400).send('Asset not issued to any employee')
        }

        await asset_history.update({
            returned_date: new Date(),
            remark: remark? `${findAsset.remark} | ${remark} - Asset Issued Entry Deleted` : `${findAsset.remark} | Asset Issued Entry Deleted` 
        }, {
            where: {
                id: findAsset.id
            }
        })

        await assets_list.update({
            status: 1 // available 
        }, {
            where: {
                id: findAsset.asset_id
            }
        })

        return res.send('Asset Deleted Successfully')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
    } 
}

module.exports = {
    issuedAssetHistoryFetch,
    assignAssetToEmployee,
    issuedAssetReturnedByEmployee,
    updateProviedAsset,
    deleteAssignedAsset
}