import express from 'express';
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const comments = [];

app.get('/reflected-xss', (req, res) => {
  res.send(`
        <form method="POST" action="/submit">
            <label for="input">Enter your name:</label>
            <input type="text" name="input" id="input">
            <button type="submit">Submit</button>
        </form>
    `);
});

app.get('/stored-xss', (req, res) => {
  res.send(`
        <form method="POST" action="/comment">
            <label for="input">Enter your comment:</label>
            <input type="text" name="input" id="input">
            <button type="submit">Submit</button>
        </form>
        <ul>
            ${comments.map((comment) => `<li>${comment}</li>`).join('')}
        </ul>
    `);
});

app.get('/dom-xss', (req, res) => {
  res.send(`
        <form method="POST" action="/dom-xss">
            <label for="input">Enter your name:</label>
            <input type="text" name="input" id="input">
            <button type="submit">Submit</button>
        </form>
        <script>
            const urlParams = new URLSearchParams(window.location.search);
            const input = urlParams.get('input');
            document.write(\`<p>Hello, \${input}!</p>\`);
        </script>
    `);
});

app.post('/dom-xss', (req, res) => {
  const input = req.body.input;
  res.redirect(`/dom-xss?input=${input}`);
});

app.post('/comment', (req, res) => {
  const input = req.body.input;
  comments.push(input);
  res.redirect('/stored-xss');
});

app.post('/submit', (req, res) => {
  const input = req.body.input;
  res.send(`Hello, ${input}!`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
