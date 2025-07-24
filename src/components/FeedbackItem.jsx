import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Trash2, User, Calendar, Heart } from 'lucide-react';

export function FeedbackItem({ feedback, onVote, onDelete, isLoading }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleVote = async (action) => {
    if (isVoting || isLoading) return;

    setIsVoting(true);
    try {
      await onVote(feedback.id, action);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting || isLoading) return;

    setIsDeleting(true);
    try {
      await onDelete(feedback.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting:', error);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVoteColor = () => {
    if (feedback.votes > 0) return 'from-emerald-400 to-emerald-500';
    if (feedback.votes < 0) return 'from-rose-400 to-rose-500';
    return 'from-slate-300 to-slate-400';
  };

  return (
    <>
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg p-6 border border-white/30 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] group">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {feedback.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <Heart className="w-2 h-2 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                {feedback.name}
              </h3>
              <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(feedback.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading || isDeleting}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-50 opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-slate-50/50 backdrop-blur-sm p-5 rounded-2xl border border-slate-100/50">
            <p className="text-slate-700 leading-relaxed">{feedback.message}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote('upvote')}
              disabled={isVoting || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200 disabled:opacity-50 font-medium text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              Helpful
            </button>

            <button
              onClick={() => handleVote('downvote')}
              disabled={isVoting || isLoading}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 disabled:opacity-50 font-medium text-sm"
            >
              <ThumbsDown className="w-4 h-4" />
              Not Helpful
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${getVoteColor()} shadow-md`}
            >
              {feedback.votes > 0 ? '+' : ''}
              {feedback.votes}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/50">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Feedback?</h3>
              <p className="text-slate-600">
                This action cannot be undone. The feedback will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-2xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
