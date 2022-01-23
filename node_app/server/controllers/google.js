const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

async function createAndUploadFile(fileName, fileContent, auth)
{
    const drive = google.drive({version: 'v3', auth});
    const fileMetadata = {
        'name': fileName,
        'parent': '1iT9H5VuUlvranUcThB9Nt3noXxJLqvS_'
    };

    let media = {
        mimeType: 'image/png',
        body: fileContent
    };

    const res = await drive.files.create({
        requestBody: {
            name: 'Test.txt',
            parent: ['1iT9H5VuUlvranUcThB9Nt3noXxJLqvS_'],
            mimeType: 'text/plain'
        },
        media: {
            mimeType: 'text/plain',
            body: 'Hello World'
        }
    });

    switch(res.status){
        case 200:
            let file = res.result;
            console.log('Created File Id: ', res.data.id);
            break;
        default:
            console.error('Error creating the file, ' + res.errors);
            break;
    }
}

async function uploadOnGoogle() {
    // service account key file from Google Cloud console.
    const KEYFILEPATH = 'secrete.json';

    // Request full drive access.
    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    // Create a service account initialize with the service account key file and scope needed
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });


    await createAndUploadFile(
        'waveform.png',
        fs.createReadStream('waveform.png'),
        auth);

}


module.exports.uploadOnGoogle = uploadOnGoogle;
