const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const path = require('path');

const app = express();

const axios = require('axios');
const { response } = require('express');

app.use(fileUpload());
app.use(express.static(path.join(__dirname, '/client/public')));

// Upload Endpoint
app.post('/upload', (req, res) => {
  // console.log("inside /uploads");
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const path = `${__dirname}/client/public/${Date.now().toString() + file.name}`;

  file.mv(path, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log({ path });
    axios.post("http://localhost:5000/ml", null, {
      params: {
        path
      }
    }).then(response => {
      console.log("we are getting some response", response.data);
      res.json({ fileName: file.name, filePath: `/${file.name}`, result: response.data.result, resLong: response.data.resLong });
    }).catch(err => { console.log(err); });

    // fetch(`http://localhost:5000/ml?path=${__dirname}/client/public/${file.name}`, {
    //   method: 'POST',
    // }).then(response => {
    //   console.log("we get some response", response);
    //   return response.json();
    // }).catch(err => { console.log(err); });


  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/public/index.html'));
});



app.listen(5005, () => console.log('Server Started...'));
