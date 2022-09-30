const express = require("express");
const hljs = require("highlight.js");
const dbInit = require("./db");
const { genUniqueId } = require("./utils");

const port = process.env.PORT || 8000;
const id_regex = new RegExp("^[a-zA-Z0-9]{5,15}$");
const send404 = (res) => res.status(404).json({ error: "Not Found!" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (_req, res) => {
  res.render("index.ejs", { title: "Codebin", mode: "new" });
});

app.post("/save", async (req, res) => {
  try {
    const { raw, lang } = req.body;
    const hltext = hljs.highlight(raw, { language: lang }).value;
    const id = await genUniqueId(collection);
    const data = { id, lang, raw, hltext };
    await collection.insertOne(data);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "some error occured!",
    });
  }
});

// get raw text
app.get("/:id/raw", async (req, res) => {
  const id = req.params.id;
  if (!id.match(id_regex)) return send404(res);

  const result = await collection.findOne({ id });
  if (!result) return send404(res);

  res.status(200).setHeader("content-type", "text/plain").send(result.raw);
});

// get highlighted text
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id.match(id_regex)) return send404(res);

  const result = await collection.findOne({ id });
  if (!result) return send404(res);

  res.render("index.ejs", {
    title: "Codebin",
    lang: result.lang,
    text: result.hltext,
    mode: "old",
  });
});

app.get("*", (_req, res) => send404(res));

let collection;
async function main() {
  try {
    ({ collection } = await dbInit());
    app.listen(port, () => {
      console.log(`Server is listening at port: ${port}`);
    });
  } catch (err) {
    console.error(`Error: dbInit failed: ${err}`);
    process.exit(1);
  }
}
main();
