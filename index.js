const fs = require('fs');
const path = require('path');

const port = 3000;
const app = require('express')();

app.get('/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'data', `${req.params.filename}.md`);

  if (!fs.existsSync(filePath)) res.status(404).send('File not found');
  else res.send(fs.readFileSync(filePath, 'utf-8'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
