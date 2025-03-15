import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, X, CheckCircle, AlertTriangle } from 'lucide-react';

const FeedbackForm: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isDarkMode = darkMode ?? false;
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'ok' | 'error'>('unknown');

  // Check if Supabase connection is working
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('feedback').select('count', { count: 'exact', head: true });

        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
        } else {
          setConnectionStatus('ok');
        }
      } catch (err) {
        console.error('Failed to check Supabase connection:', err);
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Verify environment variables are available
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Database configuration is incomplete');
      }

      const { error: supabaseError } = await supabase
        .from('feedback')
        .insert([{
          feedback,
          email: email || null,
          created_at: new Date().toISOString()
        }]);

      if (supabaseError) {
        throw new Error(supabaseError.message || 'Unknown database error');
      }

      setSubmitted(true);
      setFeedback('');
      setEmail('');
      
      // Auto close after successful submission
      setTimeout(() => {
        setIsOpen(false);
        // Reset submitted state after the form is closed
        setTimeout(() => setSubmitted(false), 300);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(`Failed to submit feedback: ${err.message || 'Unknown error'}`);
    }

    setIsSubmitting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`${
          isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-medium p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift`}
        aria-label="Open feedback form"
      >
        <Send size={20} />
      </button>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} rounded-xl shadow-xl p-4 w-80 transition-all duration-300 card-hover`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Share Your Feedback</h3>
        <button
          onClick={() => setIsOpen(false)}
          className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          aria-label="Close feedback form"
        >
          <X size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
        </button>
      </div>

      {connectionStatus === 'error' && (
        <div className={`${isDarkMode ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'} p-3 rounded-lg mb-4 flex items-start gap-2`}>
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">Unable to connect to database. Your feedback might not be saved.</p>
        </div>
      )}

      {error && (
        <div className={`${isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'} p-3 rounded-lg mb-4 flex items-start gap-2`}>
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {submitted ? (
        <div className={`${isDarkMode ? 'bg-green-900/30 text-green-200' : 'bg-green-50 text-green-800'} p-4 rounded-lg flex items-center gap-3`}>
          <CheckCircle className="flex-shrink-0" />
          <div>
            <p className="font-medium">Thank you for your feedback!</p>
            <p className="text-sm opacity-90">We appreciate your input.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              What do you think about our calculator?
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className={`form-input text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              placeholder="Share your thoughts, suggestions, or report issues..."
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Email (optional)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
              placeholder="you@example.com"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Only if you'd like us to follow up with you
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`flex-1 py-2 px-4 border rounded-lg text-sm font-medium transition-colors 
                ${isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || connectionStatus === 'error' || !feedback.trim()}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5
                ${(isSubmitting || connectionStatus === 'error' || !feedback.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
              {!isSubmitting && <Send size={14} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;