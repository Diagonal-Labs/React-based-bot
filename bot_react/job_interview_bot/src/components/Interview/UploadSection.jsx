import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../styles/interview.css';

const UploadSection = ({ onUploadComplete, setUploadData }) => {
  const [jobTitle, setJobTitle] = useState('');

  const handleResumeUpload = async (file) => {
    // Resume parsing logic here
    const text = await parseFileToText(file);
    setUploadData(prev => ({ ...prev, resumeText: text }));
  };

  const handleJobDescriptionUpload = async (file) => {
    // Job description parsing logic here
    const text = await parseFileToText(file);
    setUploadData(prev => ({ ...prev, jobDescriptionText: text }));
  };

  const { getRootProps: getResumeProps, getInputProps: getResumeInputProps } = 
    useDropzone({ onDrop: handleResumeUpload });

  const { getRootProps: getJobProps, getInputProps: getJobInputProps } = 
    useDropzone({ onDrop: handleJobDescriptionUpload });

  return (
    <div className="upload-section">
      <h2>Welcome to Your AI Interview Session</h2>
      
      <div {...getResumeProps()} className="dropzone">
        <input {...getResumeInputProps()} />
        <p>Drop your resume here or click to select</p>
      </div>

      <input
        type="text"
        placeholder="Enter job title"
        value={jobTitle}
        onChange={(e) => {
          setJobTitle(e.target.value);
          setUploadData(prev => ({ ...prev, jobTitle: e.target.value }));
        }}
      />

      <div {...getJobProps()} className="dropzone">
        <input {...getJobInputProps()} />
        <p>Drop job description here or click to select (optional)</p>
      </div>

      <button onClick={onUploadComplete}>Start Interview</button>
    </div>
  );
};

export default UploadSection; 