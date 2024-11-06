import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Assuming you have an auth context
import UploadSection from './UploadSection';
import AudioRecorder from './AudioRecorder';
import QuestionDisplay from './QuestionDisplay';
import ProgressBar from './ProgressBar';
import Evaluation from './Evaluation';
// import FeedbackModal from './FeedbackModal';
import '../../styles/interview.css';

const Interview = () => {
  const { currentUser } = useAuth();
  const [interviewState, setInterviewState] = useState({
    stage: 'upload', // upload, interview, evaluation
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

  const handleUploadSubmit = async () => {
    try {
      const response = await axios.post(
        'https://us-central1-interview-bot-dev-434810.cloudfunctions.net/interview-bot-backend-dev',
        {
          user_id: currentUser.uid,
          email: currentUser.email,
          resume: uploadData.resumeText,
          job_title: uploadData.jobTitle,
          job_description: uploadData.jobDescriptionText,
          action: 'start_interview',
          device: getDeviceInfo().device,
          os: getDeviceInfo().os,
          browser: getDeviceInfo().browser
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
      // Handle error appropriately
    }
  };

  const handleAnswerSubmit = async (audioBlob) => {
    try {
      // Upload audio logic here
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('user_id', currentUser.uid);
      formData.append('session_id', interviewState.sessionId);
      formData.append('question_index', interviewState.questionIndex);

      const response = await axios.post(
        'https://us-central1-interview-bot-dev-434810.cloudfunctions.net/interview-bot-backend-dev',
        formData
      );

      if (response.data.interview_complete) {
        setInterviewState(prev => ({
          ...prev,
          stage: 'evaluation',
          evaluation: response.data.text
        }));
      } else {
        setInterviewState(prev => ({
          ...prev,
          questionIndex: prev.questionIndex + 1,
          currentQuestion: response.data.text
        }));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Handle error appropriately
    }
  };

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