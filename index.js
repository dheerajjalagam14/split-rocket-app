const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
      port = 3000;

app.use(bodyParser.json());
app.use(express.static(process.cwd()+"/split-rocket-ui/dist/split-rocket-ui/"));


app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/split-rocket-ui/dist/split-rocket-ui/index.html")
});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});