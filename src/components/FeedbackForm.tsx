import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface FeedbackFormProps {
  darkMode: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ darkMode }) => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');
  // Check if Supabase connection is working
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Just a simple ping to see if Supabase is responding
        const { data, error } = await supabase.from('feedback').select('count', { count: 'exact', head: true });

        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
        } else {
          console.log('Supabase connected successfully');
          setConnectionStatus('ok');
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, []);

  // Check dark mode on client side only
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  if (submitted) {
    return (
      <div className={`${darkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'} p-4 rounded-lg`}>
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     // Verify environment variables are available
  //     if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  //       throw new Error('Supabase URL is not configured');
  //     }

  //     if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  //       throw new Error('Supabase Anon Key is not configured');
  //     }

  //     console.log('Attempting to connect to:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  //     const { error: supabaseError, data } = await supabase
  //       .from('feedback')
  //       .insert([{
  //         feedback,
  //         email: email || null, // Handle empty email gracefully
  //         created_at: new Date().toISOString()
  //       }]);

  //     console.log('Response:', data);

  //     if (supabaseError) {
  //       console.error('Supabase error details:', supabaseError);
  //       throw new Error(supabaseError.message || 'Unknown database error');
  //     }

  //     setSubmitted(true);
  //     setFeedback('');
  //     setEmail('');
  //   } catch (err: any) {
  //     console.error('Error submitting feedback:', err);
  //     setError(`Failed to submit feedback: ${err.message || 'Unknown error'}`);
  //   }

  //   setIsSubmitting(false);
  // };

  return (
    <form onSubmit={handleSubmit} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-sm text-sm`}>
      <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Feedback</h3>

      {connectionStatus === 'error' && (
        <div className={`${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} p-3 rounded-lg mb-4`}>
          <p className={darkMode ? 'text-yellow-200' : 'text-yellow-800'}>
            Warning: Cannot connect to database. Please check your configuration.
          </p>
        </div>
      )}

      {error && (
        <div className={`${darkMode ? 'bg-red-900/30' : 'bg-red-100'} p-3 rounded-lg mb-4`}>
          <p className={darkMode ? 'text-red-200' : 'text-red-800'}>{error}</p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="feedback" className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300 text-gray-900'}`}
          rows={3}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className={`block font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300 text-gray-900'}`}
        />
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          We'll only use this to follow up on your feedback if needed.
        </p>
      </div>

      {/* <div className="mb-4 text-sm">
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          Database connection status: {' '}
          <span className={
            connectionStatus === 'ok' 
              ? (isDarkMode ? 'text-green-400' : 'text-green-600')
              : connectionStatus === 'error'
                ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
          }>
            {connectionStatus === 'ok' ? 'Connected' : connectionStatus === 'error' ? 'Error' : 'Checking...'}
          </span>
        </p>
      </div> */}

      <button
        type="submit"
        disabled={isSubmitting || connectionStatus === 'error'}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;