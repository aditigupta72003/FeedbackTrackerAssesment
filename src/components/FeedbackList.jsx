import React from 'react';
import { MessageCircle, TrendingUp } from 'lucide-react';
import { FeedbackItem } from './FeedbackItem';

export function FeedbackList({ feedback, onVote, onDelete, isLoading }) {
  if (feedback.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback yet</h3>
        <p className="text-gray-500">
          Be the first to share your thoughts! Your feedback helps us improve.
        </p>
      </div>
    );
  }

  const totalVotes = feedback.reduce((sum, item) => sum + item.votes, 0);
  const averageVotes = feedback.length > 0 ? (totalVotes / feedback.length).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Feedback Overview</h2>
              <p className="text-gray-600">Community insights and ratings</p>
            </div>
          </div>
          
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{feedback.length}</div>
              <div className="text-sm text-gray-500">Total Feedback</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{totalVotes}</div>
              <div className="text-sm text-gray-500">Total Votes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{averageVotes}</div>
              <div className="text-sm text-gray-500">Avg. Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {feedback.map((item) => (
          <FeedbackItem
            key={item.id}
            feedback={item}
            onVote={onVote}
            onDelete={onDelete}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}