import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Attempting to connect to:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const { error: supabaseError, data } = await supabase
        .from('feedback')
        .insert([{ feedback, email, created_at: new Date() }]);
    
      console.log('Response:', data);
      
      if (supabaseError) {
        console.error('Supabase error details:', supabaseError);
        throw supabaseError;
      }
    
      setSubmitted(true);
      setFeedback('');
      setEmail('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    }

  if (submitted) {
    return (
      <div className={`${isDarkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'} p-4 rounded-lg`}>
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Help us improve</h3>
      
      {error && (
        <div className={`${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} p-3 rounded-lg mb-4`}>
          <p className={isDarkMode ? 'text-red-200' : 'text-red-800'}>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="feedback" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300 text-gray-900'}`}
          rows={3}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className={`block font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-300 text-gray-900'}`}
        />
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We'll only use this to follow up on your feedback if needed.
        </p>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;