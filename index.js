const express = require('express');
const multer = require('multer')
const path = require('path')
const aws = require('aws-sdk') //aws 설정을 위한 모듈
const multerS3 = require('multer-s3') //aws s3에 업로드하기 위한 multer 설정
const app = express();
const PORT = 8000;

//aws 설정
aws.config.update({
    accessKeyId:'AKIAT4J7L456G5UNWQG7',
    secretAccessKey: "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",
    region: 'ap-southeast-2'
})
//aws s3 인스턴스 생성
const s3 = new aws.S3();


//ejs
app.set('view engine', 'ejs');
//body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(__dirname + '/uploads'));

//multer 설정
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'uploads/')
//     },
//     filename: (req, file, cb)=>{
//         const ext = path.extname(file.originalname);
//         const newName = path.basename(file.originalname, ext) + Date.now() + ext;
//         cb(null, newName)
//     }
// });

// const limits = {
//     fileSize: 5 * 1024 * 1024
// }

// const upload = multer({storage, limits});

//multer 설정 - aws
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'test-asong-multer',
        acl: 'public-read', //파일 접근 권한(public-read로 해야 업로드된 파일이 공개)
        metadata: function(req, file, cb){
            cb(null, { fieldName: file.fieldname })
        },
        key: function(req, file, cb){
            cb(null, Date.now().toString() + '_' + file.originalname)
        }
    })
})

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
