const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const axios = require('axios');

app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  // console.log("inside /uploads");
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/client/public/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    console.log({ path: `${__dirname}/client/public/${file.name}` });

    axios.post("http://localhost:5000/ml", null, {
      params: {
        path: `${__dirname}/client/public/${file.name}`
      }
    }).then(response => {
      console.log("we get some response", response.data);
    }).catch(err => { console.log(err); });

    // fetch(`http://localhost:5000/ml?path=${__dirname}/client/public/${file.name}`, {
    //   method: 'POST',
    // }).then(response => {
    //   console.log("we get some response", response);
    //   return response.json();
    // }).catch(err => { console.log(err); });

    res.json({ fileName: file.name, filePath: `/${file.name}` });
  });
});

app.listen(5005, () => console.log('Server Started...'));
