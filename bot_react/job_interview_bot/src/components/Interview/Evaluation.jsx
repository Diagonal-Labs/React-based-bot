import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';
import '../../styles/interview.css';

const Evaluation = ({ evaluation, sessionId }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const formatEvaluation = (text) => {
    const sections = text.split(/Answer \d+:|Overall Feedback:|Overall Scoring:/);
    
    return (
      <>
        <h2>{sections[0].trim()}</h2>
        {sections.slice(1, -2).map((section, index) => (
          <div key={index} className="evaluation-section">
            <h3>Answer {index + 1}:</h3>
            <p>{section.trim()}</p>
          </div>
        ))}
        <div className="evaluation-section">
          <h3>Overall Feedback:</h3>
          <p>{sections[sections.length - 2].trim()}</p>
        </div>
        <div className="evaluation-section">
          <h3>Overall Scoring:</h3>
          <p>{sections[sections.length - 1].trim()}</p>
        </div>
      </>
    );
  };

  return (
    <div className="evaluation-container">
      <div className="evaluation-content">
        {formatEvaluation(evaluation)}
      </div>
      
      <button 
        className="feedback-button"
        onClick={() => setShowFeedback(true)}
      >
        Provide Feedback
      </button>

      {showFeedback && (
        <FeedbackModal 
          sessionId={sessionId}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
};

export default Evaluation; 