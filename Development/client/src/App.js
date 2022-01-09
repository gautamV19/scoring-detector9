import React from 'react';
import FileUpload from './components/FileUpload';
import Results from './components/Results';
import './App.css';
import { BrowserRouter, Routes, Route, Redirect } from 'react-router-dom';

const App = () => (
  <div className='container mt-4'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
