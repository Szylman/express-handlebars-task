const express = require('express');
const path = require('path');
const app = express();
const hbs = require('express-handlebars');
const multer = require("multer");

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'public/image')
        },
        filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        console.log(file);
        const [filename, ext] = file.originalname.split('.')
        cb(null, filename + '-' + uniqueSuffix + '.' + ext)
        }
    })

const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({ extended: false }));

app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about', { layout: 'dark' });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/info', (req, res) => {
    res.render('info');
});

app.get('/history', (req, res) => {
    res.render('history');
});

app.get('/hello/:name', (req,res) =>{
    res.render('hello', {name:req.params.name});
})

app.post('/contact/send-message', upload.single('uploaded_file'), (req, res) => {

    const { author, sender, title, message} = req.body;
    const image = req.file;

    if(author && sender && title && message && image) {
        res.render('contact', { isSent: true,  name: req.file.filename});
    }
    else {
        res.render('contact', { isError: true });
    }
});

app.use((req, res) => {
    res.status(404).send('404 not found...');
})

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});