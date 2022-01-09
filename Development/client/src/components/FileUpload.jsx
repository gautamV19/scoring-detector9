import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";
import Audio from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import {
  Chart,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import "hammerjs";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isScoring, setScoring] = useState(null);
  const [long, setLong] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const video = e.target.files[0];
    setFile(video);
    setFilename(video.name + Date.now().toString());
    video.preload = "metadata";
    console.log(video.size);
    video.size > 1500000 ? setLong(true) : setLong(false);
  };

  const onSubmit = async (e) => {
    if (file.type === "video/mp4") {
      e.preventDefault();
      const formData = new FormData();
      formData.append("file", file);
      console.log(file, filename);

      try {
        setLoading(true);
        const res = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          },
        });

        // Clear percentage
        setTimeout(() => setUploadPercentage(0), 10000);

        const { fileName, filePath, result, isScoring } = res.data;

        if (long) setData(result);
        else setScoring(isScoring);

        setUploadedFile({ fileName, filePath });

        setMessage("File Uploaded");
      } catch (err) {
        if (err.response.status === 500) {
          setMessage("There was a problem with the server");
        } else {
          setMessage(err.response.data.msg);
        }
        setUploadPercentage(0);
      }
    } else {
      e.preventDefault();
      setMessage("Upload a valid mp4 file. ");
    }
  };

  const Result = () => {
    // setLoading(false);
    if (long) {
      console.log(data);
      return (
        <div>
          <span>Probability of scoring Vs Time</span>
          <Chart
            style={{
              width: "70vw",
              height: "40vh",
              inline: true,
            }}
            pannable={{
              lock: "y",
            }}
            zoomable={{
              mousewheel: {
                lock: "y",
              },
            }}
          >
            <ChartValueAxis>
              <ChartValueAxisItem
                title={{
                  text: "Probability of scoring",
                }}
                min={0}
                max={1.0}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem data={data} style={{ color: "red" }} />
            </ChartSeries>
          </Chart>
        </div>
      );
    } else {
      if (isScoring) {
        return <div className="text-center">It is a scoring event</div>;
      } else if (isScoring === false) {
        return <div className="text-center">Not Scoring</div>;
      }
    }
  };

  return (
    <Fragment>
      <div className="col-md-6 offset-md-3">
        <form onSubmit={onSubmit}>
          {message ? <Message msg={message} /> : null}
          <div className="custom-file mb-4">
            <input
              type="file"
              className="custom-file-input"
              id="customFile"
              onChange={onChange}
            />
            <label className="custom-file-label" htmlFor="customFile">
              {filename}
            </label>
          </div>

          <Progress percentage={uploadPercentage} />

          <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block mt-4"
          />
        </form>
      </div>

      {uploadedFile ? (
        <div className="row mt-5 text-center">
          {Result() || (loading && "Loading...")}
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
