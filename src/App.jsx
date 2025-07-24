import React, { useState, useEffect } from 'react';
import { MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { FeedbackForm } from './components/FeedbackForm';
import { FeedbackList } from './components/FeedbackList';
import { feedbackApi } from './services/api';

function App() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

// Update your loadFeedback function to:
 const loadFeedback = async () => {
     try {
       setError(null);
+      console.log('Loading feedback...');
       const data = await feedbackApi.getAllFeedback();
+      console.log('Feedback loaded:', data);
       setFeedback(data);
     } catch (err) {
       console.error('Error loading feedback:', err);
-      setError('Failed to load feedback. Please make sure the server is running.');
+      setError(`Failed to load feedback: ${err.message}. Please make sure the server is running on http://localhost:3001`);
     } finally {
       setIsInitialLoading(false);
     }
   };

   // ✅ Load feedback when app starts
  useEffect(() => {
    console.log('🚀 App mounted! Calling loadFeedback...');
    loadFeedback();
  }, []);

  const handleSubmitFeedback = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newFeedback = await feedbackApi.createFeedback(data);
      setFeedback(prev => [newFeedback, ...prev]);
      setSuccess('Thank you for your feedback! It has been submitted successfully.');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (id, action) => {
    try {
      setError(null);
      const updatedFeedback = await feedbackApi.voteFeedback(id, action);
      setFeedback(prev =>
        prev.map(item => item.id === id ? updatedFeedback : item)
      );
    } catch (err) {
      console.error('Error voting on feedback:', err);
      setError(err.message || 'Failed to vote. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await feedbackApi.deleteFeedback(id);
      setFeedback(prev => prev.filter(item => item.id !== id));
      setSuccess('Feedback deleted successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(err.message || 'Failed to delete feedback. Please try again.');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Feedback Tracker</h1>
              <p className="text-gray-600">Share your thoughts and help us improve</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div>
            <FeedbackForm onSubmit={handleSubmitFeedback} isLoading={isLoading} />
          </div>

          {/* Feedback List */}
          <div>
            <FeedbackList
              feedback={feedback}
              onVote={handleVote}
              onDelete={handleDelete}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;