const express = require('express');
const hljs = require('highlight.js');
const dbInit = require('./db');
const { genUniqueId } = require('./utils');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'));
app.set("view engine", "ejs");

app.get('/', (_req, res) => {
  res.render('index.ejs', { title: 'Codebin', mode: 'new' })
});

app.post('/save', async (req, res) => {
  try {
    const { src, lang } = req.body;
    const text = hljs.highlight(src, { language: lang }).value;
    const id = await genUniqueId(collection);
    const data = { id, lang, text };
    await collection.insertOne(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'some error occured!'
    });
  }
});

app.get(new RegExp('/[a-zA-Z0-9]{5,}'), async (req, res) => {
  const id = req.url.substring(1);
  if (id.length < 5) {
    res.status(404).send('Page not found.');
    return;
  }
  const result = await collection.findOne({ id });
  if (result == null) send404(res);
  else {
    res.render('index.ejs', {
      title: 'Codebin',
      lang: result.lang,
      text: result.text,
      mode: 'old'
    });
  }
});

app.get('*', (_req, res) => {
  send404(res);
});

function send404(res) {
  res.status(404).json({error: 'Not Found!'})
}

let collection;
async function main() {
  try {
    ({ collection } = await dbInit());
    app.listen(PORT, () => {
    console.log(`Server is listening at port: ${PORT}`);
    });
  } catch (err) {
    console.error(`Error: dbInit failed: ${err}`);
    process.exit(1);
  }
}
main();
