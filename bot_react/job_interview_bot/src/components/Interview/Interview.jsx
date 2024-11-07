import React, { useState, useEffect } from 'react';
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UploadSection from './UploadSection';
import ProgressBar from './ProgressBar';
import QuestionDisplay from './QuestionDisplay';
import AudioRecorder from './AudioRecorder';
import Evaluation from './Evaluation';

const Interview = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [interviewState, setInterviewState] = useState({
    stage: 'upload',
    sessionId: null,
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 5,
    evaluation: null,
  });

  const [uploadData, setUploadData] = useState({
    resumeText: '',
    jobTitle: '',
    jobDescriptionText: '',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log("No user logged in");
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUploadSubmit = async () => {
    try {
      // Check if user is authenticated
      if (!currentUser) {
        console.error('No user logged in');
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!uploadData.resumeText || !uploadData.jobTitle) {
        console.error('Resume and job title are required');
        // Show error message to user
        return;
      }

      const response = await axios.post(
        'https://us-central1-interview-bot-dev-434810.cloudfunctions.net/interview-bot-backend-dev',
        {
          user_id: currentUser.uid,
          email: currentUser.email,
          resume: uploadData.resumeText,
          job_title: uploadData.jobTitle,
          job_description: uploadData.jobDescriptionText,
          action: 'start_interview',
          device: 'web',
          os: navigator.platform,
          browser: navigator.userAgent
        }
      );

      if (response.data.status === 'Interview started successfully') {
        setInterviewState(prev => ({
          ...prev,
          stage: 'interview',
          sessionId: response.data.session_id,
          currentQuestion: "Tell me about yourself and why you are interested in this role"
        }));
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      // Show error message to user
    }
  };

  const handleAnswerSubmit = async (audioBlob) => {
    // ... existing answer submission code ...
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="interview-container">
      {interviewState.stage === 'upload' && (
        <UploadSection 
          onUploadComplete={handleUploadSubmit}
          setUploadData={setUploadData}
        />
      )}

      {interviewState.stage === 'interview' && (
        <>
          <ProgressBar 
            current={interviewState.questionIndex + 1}
            total={interviewState.totalQuestions}
          />
          <QuestionDisplay 
            question={interviewState.currentQuestion}
            questionNumber={interviewState.questionIndex + 1}
          />
          <AudioRecorder onSubmit={handleAnswerSubmit} />
        </>
      )}

      {interviewState.stage === 'evaluation' && (
        <Evaluation 
          evaluation={interviewState.evaluation}
          sessionId={interviewState.sessionId}
        />
      )}
    </div>
  );
};

export default Interview;