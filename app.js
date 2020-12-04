const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/email', (req, res) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESSKEYID,
        secretAccessKey: process.env.AWS_SECRETACCESSKEY,
        region: process.env.AWS_REGION
    });

    const docClient = new AWS.DynamoDB();

    console.log(`email: ${req.body.email}`);

    const params = {
        TableName: process.env.AWS_EMAIL_TABLE_NAME,
        Item: {
            email : { 
                S: req.body.email 
            }
        }
    };

    docClient.putItem(params, function(err, data) {
        if (err) {
            console.log(err);
            res.send({
                success: false,
                message: 'Error: Server error'
            });
        } else {
            res.send({
                success: true,
                message: 'Saved blog',
                blogs: data
            });
        }
    });
})

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});