const express = require('express');
const multer = require('multer')
const path = require('path')
const app = express();
const PORT = 8000;

//ejs
app.set('view engine', 'ejs');
//body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'));

//multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads/')
    },
    filename: (req, file, cb)=>{
        const ext = path.extname(file.originalname);
        const newName = path.basename(file.originalname, ext) + Date.now() + ext;
        cb(null, newName)
    }
});

const limits = {
    fileSize: 5 * 1024 * 1024
}

const upload = multer({storage, limits});

app.post('/upload', upload.array('userfiles'), (req, res)=>{
    console.log(req.files);
    res.send(req.files);
})


//router
app.get('/', (req, res) => {
    res.render('index');
});

app.use('*', (req,res)=>{
    res.render('404')
})

//server open
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
