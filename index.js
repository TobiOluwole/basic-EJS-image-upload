const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const ejs = require('ejs');
let fs = require('fs');
const app = express();
const port = process.env.PORT || 1111;

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 200000
    },
    fileFilter: function (req, file, cb) {
        chechFileType(file, cb);
    }
}).single('image')

function chechFileType(file, cb) {
    const fileTypes = /jpeg|jpg|gif|png/;

    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb('Error: images only!!')
    }
}

// parse requests
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');
// app.set('views',path.resolve(__dirname,'views/'));

// assests
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', function (req, res) {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                error: err
            })
        } else {
        console.log(req.file) // logs file info
        if(typeof req.file == 'undefined'){
            res.render('index', {
                error: 'Please select a file'
            })
        }else{
            res.render('index', {
                error: 'File uploaded',
                file: `uploads/${req.file.filename}`
            })
        }
        }
    })
});


app.use(morgan('tiny'));

app.listen(port, () => {
    console.log('[EXPRESS] Server Running on Port ' + port + ' ...');
});