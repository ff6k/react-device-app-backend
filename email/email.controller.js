const express = require('express');
const router = express.Router();
const mailService = require('./email.service');
const emailExistence = require('email-existence');
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

// routes
router.get('/existence', existence);
router.post('/sendSMSOverHTTP', sendSMSOverHTTP);
router.post('/sendMailOverHTTP', sendMailOverHTTP);

module.exports = router;

const accountSid = "AC0b6ed65b3b28b81e5816eeb39c2e30cd";
const authToken = "59c24ba047f4732df8791cd093f3901b";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // user: 'rocket.iot.at@gmail.com',
        // pass: 'InformYourCostumer'
        user: 'anatolloflint@gmail.com',
        pass: 'cartographerclarine?'
    }
});

function existence(req, res, next) {
    const email = req.query.email; 
    emailExistence.check(email, (err, re) => {       
        return res.json(re);
    });
}

function sendSMSOverHTTP(req, res) {
    console.log(req.body);
    cors(req, res, () => {
      const client = require("twilio")(accountSid, authToken);
      const phone = req.body.phone
      const name = req.body.name
      const message = req.body.message
  
      const body = `
      Hi ${name}.
      Occured some error from your device. 
      The error is like follow.
      ${message}
      `
  
      return client.messages
        .create({
          body: body,
          from: "+79600315449",
          to: phone,
        })
        .then((message) =>{return res.send({ data: message, phone: phone })})
        .catch(error=>{return res.send( {error:error, phone: phone} )})  
    });
};
  
function sendMailOverHTTP(req, res) {    
    cors(req, res, ()=>{        
        const mailOptions = {
            from: `contact@rockets.co`,
            to: req.body.email,
            subject: req.body.subject,
            html: req.body.emailBody                          
        };


        return transporter.sendMail(mailOptions, (error, data) => {
            if (error) {
                return res.send({error});
            }
            var resData = JSON.stringify(data)
            return res.send({resData});
        });
    })
}; 