const fs = require('fs');
const path = require('path');

const port = 3000;
const app = require('express')();

const getTerms = () => {
    const termExceptions = require('./data/termExceptions.json');
    return fs.readdirSync(path.join(__dirname, 'data'))
        .map(file => file.replace('.md', ''))
        .filter(file => !termExceptions.includes(file));
}

app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    if (filename === "terms") {
        res.send(getTerms())
        return
    }

    const filePath = path.join(__dirname, 'data', `${req.params.filename}.md`);

    if (!fs.existsSync(filePath)) res.status(404).send('File not found');
    else res.send(fs.readFileSync(filePath, 'utf-8'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
