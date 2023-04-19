const fs = require('fs');
const { join } = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const port = 3000;
const mailOptions = {
    from: '"Bridge America" <bridgeamerica.sub@outlook.com>', 
    to: 'tadahiroueta@gmail.com', 
    subject: 'Article Submission'
};


const app = require('express')();
app.use(require('cors')()); // for cross-origin requests (different domain)

// for post requests with body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'bridgeamerica.sub@outlook.com',
        pass: 'BridgeAmerica'
}});



const getTerms = () => {
    const termExceptions = require('./data/termExceptions.json');
    return fs.readdirSync(join(__dirname, 'data'))
        .map(file => file.replace('.md', ''))
        .filter(file => !termExceptions.includes(file));
}

const sendEmail = message => transporter
    .sendMail({ ...mailOptions, html: message }, (error, info) => {
        if (error) console.log(error);
        else console.log('Message sent: %s.', info.messageId);
    });



app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    if (filename === "terms") {
        res.send(getTerms())
        return
    }

    const filePath = join(__dirname, 'data', `${req.params.filename}.md`);

    if (!fs.existsSync(filePath)) res.status(404).send('File not found.');
    else res.send(fs.readFileSync(filePath, 'utf-8'));
});

app.post('/submit', (req, res) => {
    sendEmail(req.body.markdown);
    res.send("Email sent.")
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
