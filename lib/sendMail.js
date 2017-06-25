/**
 * Created by hassaan on 1/11/16.
 */
emailConfig = require('../config/emailConfig.json');
var sender = emailConfig.config.sender;
var sender_email = emailConfig.config.senderEmail;
exports.sendSingle = function(recipient, subject, body, callback) {
	if (emailConfig.serviceType == 'mailgun') {
		var mailgun = require('mailgun-js')(emailConfig.config);
		var data = {
			from: sender+' '+'<'+sender_email+'>',
			to: recipient,
			subject: subject,
			html: body
		};
		mailgun.messages().send(data, function (error, body) {
			console.log(body);
			callback();
		});
	}
	else if (emailConfig.serviceType == 'nodemailer') {
		var transportConf = emailConfig.config;
		var transport = mailer.createTransport(smtpTransport(transportConf));
		var mailOptions = {
			from: sender+' '+'<'+sender_email+'>',
			to: recipient,
			subject: subject,
			html: body
		}
		transport.sendMail(mailOptions, function (err, responseStatus) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				console.log("not err");
				callback();
			}
		});
	}
	else{
		callback({error:7000, message:'no known method was configured'});
	}
}