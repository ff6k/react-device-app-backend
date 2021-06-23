const db = require('_helpers/db');
const Product = db.Product;

module.exports = {
    getAll,
    getById,
    getByUID,
    create,
    update,
    delete: _delete,
    deleteByIds: deleteByIds
};

async function getAll() {
    return await Product.find();
}

async function getById(id) {  
    return await Product.findById(id);
}

async function getByUID(productParam) {
    return await Product.findOne({ uid: productParam.uid }); 
}

async function create(productParam) {
    // validate
    if (await Product.findOne({ uid: productParam.uid })) {
        throw 'ID "' + productParam.uid + '" is already taken';
    }

    if (await Product.findOne({ name: productParam.name })) {
        throw 'Name "' + productParam.name + '" is already taken';
    }

    const product = new Product(productParam);

    // save product
    await product.save();
}

async function update(id, productParam) { 
    const product = await Product.findById(id);

    // validate
    if (!product) throw 'Product not found';
    if (product.name !== productParam.name && await Product.findOne({ name: productParam.name })) {
        throw 'Productname "' + productParam.name + '" is already taken';
    }

    // copy productParam properties to product
    Object.assign(product, productParam);

    await product.save();
}

async function _delete(id) { 
    await Product.findByIdAndRemove(id);
}

async function deleteByIds(ids) { 
    ids.map(async id => {
        await Product.findByIdAndRemove(id);
    })    
}