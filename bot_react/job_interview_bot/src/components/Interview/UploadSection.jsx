import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../styles/interview.css';

const parseFileToText = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const UploadSection = ({ onUploadComplete, setUploadData }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    resume: null,
    jobDescription: null
  });

  const handleResumeUpload = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const text = await parseFileToText(file);
      setUploadData(prev => ({ ...prev, resumeText: text }));
      setUploadedFiles(prev => ({ ...prev, resume: file.name }));
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };

  const handleJobDescriptionUpload = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      const text = await parseFileToText(file);
      setUploadData(prev => ({ ...prev, jobDescriptionText: text }));
      setUploadedFiles(prev => ({ ...prev, jobDescription: file.name }));
    } catch (error) {
      console.error('Error uploading job description:', error);
    }
  };

  const { getRootProps: getResumeProps, getInputProps: getResumeInputProps } = 
    useDropzone({
      onDrop: handleResumeUpload,
      accept: {
        'text/plain': ['.txt'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      multiple: false
    });

  const { getRootProps: getJobProps, getInputProps: getJobInputProps } = 
    useDropzone({
      onDrop: handleJobDescriptionUpload,
      accept: {
        'text/plain': ['.txt'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
      },
      multiple: false
    });

  const handleRemoveFile = (fileType) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: null }));
    setUploadData(prev => ({ 
      ...prev, 
      [fileType === 'resume' ? 'resumeText' : 'jobDescriptionText']: '' 
    }));
  };

  return (
    <div className="upload-section">
      <h2>Welcome to Your AI Interview Session</h2>
      
      <div {...getResumeProps()} className="dropzone">
        <input {...getResumeInputProps()} />
        {!uploadedFiles.resume ? (
          <p>Drop your resume here or click to select</p>
        ) : (
          <div className="uploaded-file">
            <p className="uploaded-file-name">Uploaded: {uploadedFiles.resume}</p>
            <button 
              className="remove-file"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile('resume');
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter job title"
        value={jobTitle}
        onChange={(e) => {
          setJobTitle(e.target.value);
          setUploadData(prev => ({ ...prev, jobTitle: e.target.value }));
        }}
        className="job-title-input"
      />

      <div {...getJobProps()} className="dropzone">
        <input {...getJobInputProps()} />
        {!uploadedFiles.jobDescription ? (
          <p>Drop job description here or click to select (optional)</p>
        ) : (
          <div className="uploaded-file">
            <p className="uploaded-file-name">Uploaded: {uploadedFiles.jobDescription}</p>
            <button 
              className="remove-file"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile('jobDescription');
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button 
        onClick={onUploadComplete}
        className="start-button"
        disabled={!uploadedFiles.resume || !jobTitle}
      >
        Start Interview
      </button>
    </div>
  );
};

export default UploadSection;