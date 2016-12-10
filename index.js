var fs = require('fs');
var request = require('request');

var JWT = process.env.JWT;
var SPACE_ID = process.env.SPACE_ID;
var FILE_PATH = process.env.FILE_PATH;

if (!JWT) {
    console.error('Expected JWT in environment variable called "JWT"!');
    process.exit(1);
}

if (!SPACE_ID) {
    console.error('Expected space ID in environment variable called "SPACE_ID"!');
    process.exit(1);
}

if (!FILE_PATH) {
    console.error('Expected file path in environment variable called "FILE_PATH"!');
    process.exit(1);
}

function precheck() {
    request.post({
        url: 'https://api.watsonwork.ibm.com/files/api/v1/files/file/precheck',
        headers: {
            Authorization: 'Bearer ' + process.env.JWT,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            space: process.env.SPACE_ID,
            name: 'Foo.png',
            size: 17
        })
    }, (err, resp, body) => {
        if (err) {
            console.error('Got an error during precheck!');
            console.error(err);
        } else {
            console.log('Precheck response:', JSON.parse(body));
            upload();
        }
    });
}

function upload() {
    request.post({
        url: 'https://api.watsonwork.ibm.com/files/api/v1/files/file/',
        headers: {
            Authorization: 'Bearer ' + process.env.JWT,
        },
        formData: {
            file: fs.createReadStream(FILE_PATH),
            attributes: {
                value: JSON.stringify({
                    space: process.env.SPACE_ID,
                    name: 'ignored',
                    size: 17
                }),
                options: {
                    contentType: 'application/json'
                }
            }
        }
    }, (err, resp, body) => {
        if (err) {
            console.error('Got an error during upload!');
            console.error(err);
        } else {
            console.log('Upload response:', JSON.parse(body));
        }
    });
}

precheck();

