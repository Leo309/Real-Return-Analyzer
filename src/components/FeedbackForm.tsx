import React, { useState } from 'react';
import { MessageSquare, Star, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface FeedbackFormProps {
  darkMode: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ darkMode }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // In a real implementation, you would send the feedback to your server
      // Example:
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, message, rating }),
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setEmail('');
      setMessage('');
      setRating(0);
      
      // Close the form after showing thank you message
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeedback = () => {
    setIsOpen(!isOpen);
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  return (
    <div>
      {/* Feedback button */}
      <button
        onClick={toggleFeedback}
        className={`p-3 rounded-full shadow-lg transition-all duration-300 
          ${darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        aria-label="Give feedback"
      >
        <MessageSquare size={20} />
      </button>

      {/* Feedback modal */}
      {isOpen && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${darkMode ? 'bg-black/50' : 'bg-gray-800/30'}`}>
          <div 
            className={`relative rounded-xl shadow-2xl w-full max-w-md mx-auto transition-all duration-300 transform 
              ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <button 
              onClick={toggleFeedback}
              className={`absolute top-3 right-3 p-1 rounded-full
                ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'}`}
            >
              <X size={20} />
            </button>
            
            <div className="p-6">
              {!isSubmitted ? (
                <>
                  <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('feedback.title')}
                  </h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('feedback.ratingLabel')}
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={24}
                              className={`${
                                rating >= star
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : darkMode
                                  ? 'text-gray-600'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('feedback.emailLabel')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md
                          ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        placeholder="youremail@example.com"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {t('feedback.messageLabel')}
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        required
                        className={`w-full px-3 py-2 border rounded-md
                          ${darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                        placeholder={t('feedback.placeholder')}
                      />
                    </div>
                    
                    {error && (
                      <div className={`p-3 mb-4 rounded-md ${darkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
                        {error}
                      </div>
                    )}
                    
                    <button
                      type="submit"
                      disabled={isSubmitting || !message}
                      className={`w-full py-2 px-4 rounded-md font-medium transition-colors
                        ${isSubmitting || !message
                          ? (darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-500')
                          : (darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                        }`}
                    >
                      {isSubmitting ? t('common.loading') : t('feedback.submitButton')}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className={`mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full ${
                    darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {t('feedback.thankYou')}
                  </h3>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    We appreciate your input and will use it to improve the calculator.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;