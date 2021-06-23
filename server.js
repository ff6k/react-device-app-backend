require('rootpath')();
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const constant = require('./utils/constant');
const errorHandler = require('_helpers/error-handler');
const messageService = require('./messages/message.service');
const productService = require('./products/product.service');
const userService = require('./users/user.service');
const emailService = require('./email/email.service');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());
// api routes
app.use('/users', require('./users/users.controller'));
app.use('/customers', require('./customers/customers.controller'));
app.use('/products', require('./products/products.controller'));
app.use('/messages', require('./messages/messages.controller'));
app.use('/email', require('./email/email.controller')); 

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});


const func = async() => {
    await messageService.getByLog({ log: 'error' })
    .then(async(messages) => { 
        await messages.map(async(item) => { 
            const id = item.id;
            const status = item.status;
            const deviceId = item.message.ID;
            const log = item.message.log;
            const state = item.message.state;					
            const errid = item.message.errid;	
            const number = log==='info' ? state : log==='error' ? errid : 0;
            const description = constant.descriptions[log][number];
            // const errorDescription = constant.descriptions['info'][state];	
            console.log('-----','deviceId:',deviceId,'status:',log, "log:",log,"state:",state,"errid:",errid,'number:',number,"description:",description);

            if(!status) {
                await productService.getByUID({ uid: deviceId }).then(async(data) => {
                    if(data && data.categories) {
                        const users = data.categories;
                        users.map(async(userId) => {
                            const user = await userService.getById(userId).then(async(userInfo) => {
                                if(userInfo && userInfo.phone) {
                                    const phone = userInfo.phone; 
                                    const name = userInfo.displayName; 
                                    const email = userInfo.email;   
                                                            
                                    // await emailService.sendSMSOverHTTP({ phone: phone, name: name, deviceId: deviceId, message: log }).then((res) => {
                                    //     console.log(res);
                                    // });

                                    await axios.post('https://us-central1-chiplusgo-95ec4.cloudfunctions.net/textmessageV2', {
                                        "Phone": phone,
                                        "Body": `Error message from ${deviceId}`,
                                        "From": "+13462331831" 
                                    }).then(res => {
                                        console.log(res.data);
                                    }).catch(err => {
                                        console.log(err.message)
                                    });

                                    await emailService.sendMailOverHTTP({ 
                                        email: email, 
                                        subject: `Error message from ${deviceId}`,
                                        emailBody: `<h3>${number} - ${description}</h3>` 
                                    });
                                
                                    console.log(phone, name, email, 'status=',item.status, messages.length, log, deviceId, id);
                                }
                            })
                        });
                        messageService.update(id, { status: true });
                    }                
                });                             
            }
        })
    })
    .catch(err => next(err));
}

func();

// timeout
const timer = setInterval(func, 1000 * 10 * 1);

