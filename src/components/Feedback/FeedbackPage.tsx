import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, ChevronRight, Clock, PenTool as Tool, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface Question {
  id: number;
  text: string;
  type: 'rating' | 'text' | 'choice' | 'emoji' | 'yesno' | 'date' | 'completion' | 'resolution';
  options?: string[];
  emojis?: { icon: JSX.Element; value: string }[];
  conditional?: boolean;
  condition?: (answers: Record<number, any>) => boolean;
}

interface FeedbackData {
  userId: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  timestamp: string;
  location?: string;
  serviceUsed: string;
  serviceCompletion: string;
  experienceRating: string;
  providerOnTime: boolean;
  workQuality: number;
  issueResolution: string;
  recommendation: string;
  additionalFeedback?: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Which service did you use?",
    type: 'choice',
    options: [
      "Electrical", "Painting", "Plumbing", "Carpentry", "Cleaning",
      "Appliance Repair", "Pest Control", "AC Services", "CCTV",
      "Interior Design", "Gardening", "Home Automation"
    ]
  },
  {
    id: 3,
    text: "Was your service completed as expected?",
    type: 'completion',
    emojis: [
      { icon: <span className="text-4xl">🟥</span>, value: "Not Completed" },
      { icon: <span className="text-4xl">🟨</span>, value: "Partially Completed" },
      { icon: <span className="text-4xl">🟩</span>, value: "Fully Completed" }
    ]
  },
  {
    id: 4,
    text: "How was your experience with our service?",
    type: 'emoji',
    emojis: [
      { icon: <span className="text-4xl">😡</span>, value: "Very Unsatisfied" },
      { icon: <span className="text-4xl">😕</span>, value: "Unsatisfied" },
      { icon: <span className="text-4xl">😐</span>, value: "Neutral" },
      { icon: <span className="text-4xl">🙂</span>, value: "Satisfied" },
      { icon: <span className="text-4xl">😄</span>, value: "Very Satisfied" }
    ]
  },
  {
    id: 5,
    text: "Did the service provider arrive on time?",
    type: 'yesno'
  },
  {
    id: 6,
    text: "How would you rate the quality of work?",
    type: 'rating'
  },
  {
    id: 7,
    text: "Was your issue resolved properly?",
    type: 'resolution',
    emojis: [
      { icon: <span className="text-4xl">❌</span>, value: "No" },
      { icon: <span className="text-4xl">🔄</span>, value: "Still Ongoing" },
      { icon: <span className="text-4xl">✅</span>, value: "Yes" }
    ]
  },
  {
    id: 8,
    text: "Would you recommend our service to others?",
    type: 'emoji',
    emojis: [
      { icon: <span className="text-4xl">👎</span>, value: "No" },
      { icon: <span className="text-4xl">🤔</span>, value: "Maybe" },
      { icon: <span className="text-4xl">👍</span>, value: "Yes" }
    ]
  },
  {
    id: 9,
    text: "Please share any additional feedback or suggestions",
    type: 'text'
  }
];

export const FeedbackPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { serviceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { providerId, providerName } = location.state || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !providerId || !serviceId || !providerName) {
      showNotification('Missing required data for feedback submission. Please try again.');
      navigate('/services');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackData: FeedbackData = {
        userId: user.uid,
        providerId,
        providerName,
        serviceId,
        timestamp: new Date().toISOString(),
        serviceUsed: answers[1] || '',
        serviceCompletion: answers[3] || '',
        experienceRating: answers[4] || '',
        providerOnTime: answers[5] === 'Yes',
        workQuality: answers[6] || 0,
        issueResolution: answers[7] || '',
        recommendation: answers[8] || '',
        additionalFeedback: answers[9] || ''
      };

      await addDoc(collection(db, 'feedback'), feedbackData);
      setSubmitted(true);
      showNotification('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      showNotification('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'choice':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`p-4 rounded-xl transition-colors ${
                  answers[question.id] === option
                    ? 'bg-orange-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'emoji':
      case 'completion':
      case 'resolution':
        return (
          <div className="flex justify-center gap-4">
            {question.emojis?.map(({ icon, value }) => (
              <button
                key={value}
                onClick={() => handleAnswer(question.id, value)}
                className={`p-4 rounded-xl transition-colors ${
                  answers[question.id] === value
                    ? 'bg-orange-100 dark:bg-orange-900'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswer(question.id, rating)}
                className={`p-4 rounded-xl transition-colors ${
                  answers[question.id] === rating
                    ? 'bg-orange-500 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Star
                  className={`w-8 h-8 ${
                    answers[question.id] >= rating ? 'fill-current' : ''
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'yesno':
        return (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleAnswer(question.id, 'Yes')}
              className={`flex items-center gap-2 p-4 rounded-xl transition-colors ${
                answers[question.id] === 'Yes'
                  ? 'bg-green-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <ThumbsUp className="w-6 h-6" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleAnswer(question.id, 'No')}
              className={`flex items-center gap-2 p-4 rounded-xl transition-colors ${
                answers[question.id] === 'No'
                  ? 'bg-red-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <ThumbsDown className="w-6 h-6" />
              <span>No</span>
            </button>
          </div>
        );

      case 'text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            rows={4}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
            placeholder="Type your feedback here..."
          />
        );

      default:
        return null;
    }
  };

  if (!providerId || !providerName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Feedback Request
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unable to submit feedback. Missing required information.
          </p>
          <button
            onClick={() => navigate('/services')}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Return to Services
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div id="feedback" className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 py-16">
          <div className={`max-w-2xl mx-auto text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
              Thank You for Your Feedback!
            </h2>
            <p className="text-xl mb-8">
              Your feedback helps us improve our services. We appreciate your time!
            </p>
            <button
              onClick={() => navigate('/services')}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
            >
              Return to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="feedback" className={`min-h-screen pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className={`text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <h1 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
              We Value Your Feedback
            </h1>
            <p className="text-xl">
              Help us improve our services by sharing your experience with {providerName}
            </p>
          </div>

          <div className={`rounded-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl p-8`}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {questions[currentQuestion].text}
                </h2>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              {renderQuestion(questions[currentQuestion])}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                className={`px-6 py-3 rounded-xl transition-colors ${
                  currentQuestion === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                  <Send size={18} />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  className={`px-6 py-3 rounded-xl transition-colors flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;