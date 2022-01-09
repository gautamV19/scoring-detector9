import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isScoring, setScoring] = useState(null)

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name + Date.now().toString());

  };

  const onSubmit = async e => {
    if (file.type === "video/mp4") {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      console.log(file, filename)

      try {
        const res = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          }
        });

        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);

        const { fileName, filePath, score } = res.data;
        //console.log(fileName, filePath, score)
        setScoring(score)
        setUploadedFile({ fileName, filePath });

        setMessage('File Uploaded');
      } catch (err) {
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else {
          setMessage(err.response.data.msg);
        }
        setUploadPercentage(0)
      }
    }
    else {
      e.preventDefault();
      setMessage('Upload a valid mp4 file. ')
    }
  };

  const Result = () => {
    if (isScoring === true) {
      return (
        <div>
          It is a scoring event
        </div>
      )
    }
    else if (isScoring === false) {
      return (
        <div>Not Scoring</div>
      )
    }
    else {
      return (
        <div></div>
      )
    }
  }

  return (
    <Fragment>
      {!isScoring ? (
        <div className='col-md-6 offset-md-3'>
          <form onSubmit={onSubmit}>
            {message ? <Message msg={message} /> : null}
            <div className='custom-file mb-4'>
              <input type='file' className='custom-file-input' id='customFile' onChange={onChange} />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename}
              </label>
            </div>

            <Progress percentage={uploadPercentage} />

            <input type='submit' value='Upload' className='btn btn-primary btn-block mt-4' />
          </form>
        </div>
      )
        :
        null}
      {uploadedFile ? (
        <div className='row mt-5'>
          {/* <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
                    </div> */}
          {Result()}
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
