const express = require('express');
const nodemailer = require("nodemailer");

const accountSid = "AC0b6ed65b3b28b81e5816eeb39c2e30cd";
const authToken = "59c24ba047f4732df8791cd093f3901b";

module.exports = {
    sendSMSOverHTTP,  
    sendMailOverHTTP
};

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

function sendSMSOverHTTP(params) {
  const client = require("twilio")(accountSid, authToken);
  const phone = params.phone;
  const name = params.name;
  const deviceId = params.deviceId;
  const message = params.message;

  const body = `
  Hi ${name}.
  Occured some error from your device(${deviceId}). 
  `

  return client.messages
    .create({
      body: body,
      from: "+436505050180",
      to: '+43650505018',
    })
    .then((message) =>{return {message}})
    .catch(error=>{return {error}})  
};

function sendMailOverHTTP(params) {   
  const mailOptions = {
      from: `contact@rockets.co`,
      to: params.email,
      subject: params.subject,
      html: params.emailBody                          
  };
  
  return transporter.sendMail(mailOptions, (error, data) => {
      if (error) {
          return error;
      }
      return data;
  });
};


