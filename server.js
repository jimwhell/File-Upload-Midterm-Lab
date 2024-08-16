const express = require('express');
const path = require('path');
const mime = require('mime-types');
const multer = require('multer');

const app = express();


const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Please upload image files only.'), false);
    }
};

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter 
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/uploads', upload.single('myFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file or file type not supported.');
    }

    console.log(req.file);

    const fileUrl = `/uploads/${req.file.filename}`;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>File Upload Successful</title>
        </head>
        <body>
            <p>File uploaded successfully!</p>
            <img src="${fileUrl}" alt="Uploaded Image" style="max-width: 100%; height: auto;">
        </body>
        </html>
    `);
});


app.get('/file-upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const portNumber = 5000;
app.listen(portNumber, () => {
    console.log(`Server is running on port ${portNumber}`);
});
