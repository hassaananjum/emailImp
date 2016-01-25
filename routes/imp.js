/**
 * Created by hassaan on 12/31/15.
 */
var express = require('express');
var router = express.Router();
var JSONSchemaValidator = require('jsonschema').Validator;
var sendMail = require('../lib/sendMail.js');
var ejs = require('ejs');
var fs = require('fs');
/* GET home page. */
router.post('/send_message/:template', function(req, res, next) {
    var template = req.params.template;
    var data = req.body;
    var v = new JSONSchemaValidator();
    var schema = {
        "id": "/emailData",
        "type": "object",
        "properties": {
            "address": {"type": "string", required: true},
            "subject": {"type": "string", required: true},
            "title": {"type": "string", required: true},
            "para1title": {"type": "string", required: true},
            "para1": {"type": "string", required: true}
        }
    };
    var validation = v.validate(data, schema);
    if (validation.errors.length > 0) {
        var errors = [];
        validation.errors.forEach(function (element, index, array) {
            errors.push(element.stack);
        });
        res.status(400).json({error: 1000, message: errors});
    }
    else {
        fs.readFile('./message_templates/'+template+'.ejs', {encoding: 'utf8'}, function(err, email_template){
            if(err){
                console.log(err);
                res.status(500).json({error: 1002, message: "Internal Server Error"});
            }
            else {
                var body = ejs.render(email_template, data);
                sendMail.sendSingle(data.address, data.subject, body, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        res.json({status: 0, message: "Email sent successfully"});
                    }
                })
            }
        });
    }
});



module.exports = router;
