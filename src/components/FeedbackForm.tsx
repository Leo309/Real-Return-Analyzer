import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure you've created this table in your Supabase project
      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert([{ feedback, email, created_at: new Date() }]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
      setFeedback('');
      setEmail('');
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-100 p-4 rounded-lg">
        <p className="text-green-800">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-medium mb-4">Help us improve</h3>
      
      {error && (
        <div className="bg-red-100 p-3 rounded-lg mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="feedback" className="block text-gray-700 font-medium mb-2">
          Your Feedback
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          We'll only use this to follow up on your feedback if needed.
        </p>
      </div>
      
      <button
       type="submit"
       disabled={isSubmitting}
       className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
     >
       {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
     </button>
   </form>
 );
};

export default FeedbackForm;