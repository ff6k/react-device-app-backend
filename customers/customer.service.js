const db = require('_helpers/db');
const Customer = db.Customer;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    deleteByIds: deleteByIds
};

async function getAll() {
    return await Customer.find();
}

async function getById(id) {  
    return await Customer.findById(id);
}

async function create(customerParam) {
    // validate
    if (await Customer.findOne({ uid: customerParam.uid })) {
        throw 'ID "' + customerParam.uid + '" is already taken';
    }  

    if (await Customer.findOne({ email: customerParam.email })) {
        throw 'Email "' + customerParam.name + '" is already taken';
    }    

    const customer = new Customer(customerParam);

    // save customer
    await customer.save();
}

async function update(id, customerParam) { 
    const customer = await Customer.findById(id);

    // validate
    if (!customer) throw 'Customer not found';
    if (customer.name !== customerParam.name && await Customer.findOne({ name: customerParam.name })) {
        throw 'Customername "' + customerParam.name + '" is already taken';
    }

    // copy customerParam properties to customer
    Object.assign(customer, customerParam);

    await customer.save();
}

async function _delete(id) { 
    await Customer.findByIdAndRemove(id);
}

async function deleteByIds(ids) { 
    ids.map(async id => {
        await Customer.findByIdAndRemove(id);
    })    
}