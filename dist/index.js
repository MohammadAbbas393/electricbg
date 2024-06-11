const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
