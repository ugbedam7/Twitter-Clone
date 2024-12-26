import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BiRepost } from 'react-icons/bi';
import { useState } from 'react';

const CommentActions = ({ notification }) => {
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const isLiked = false;

  const handlePostComment = async (e) => {};
  const handleLikePost = async () => {};

  return (
    <div className="flex justify-between mt-3">
      <div className="flex gap-4 items-center w-2/3 justify-between">
        <div
          className="flex gap-1 items-center cursor-pointer group"
          onClick={() =>
            document
              .getElementById('comments_modal' + notification._id)
              .showModal()
          }>
          <FaRegComment className="w-4 h-4  text-slate-500 group-hover:text-sky-400" />
          <span className="text-sm text-slate-500 group-hover:text-sky-400">
            {notification.post.comments.length}
          </span>
        </div>
        {/* Modal Component from DaisyUI */}
        <dialog
          id={`comments_modal${notification._id}`}
          className="modal border-none outline-none">
          <div className="modal-box rounded border border-gray-600">
            <h3 className="font-bold text-lg mb-4">Comment</h3>
            <div className="flex flex-col gap-3 max-h-60 overflow-auto">
              {notification.post.comments.length === 0 && (
                <p className="text-sm text-slate-500">
                  No comments yet 🤔 Be the first one 😉
                </p>
              )}
            </div>
            <form
              className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2"
              onSubmit={handlePostComment}>
              <textarea
                className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800"
                placeholder="Post your reply"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                {isLoading ? <LoadingSpinner size="md" /> : 'Reply'}
              </button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button className="outline-none">close</button>
          </form>
        </dialog>

        <div className="flex gap-1 items-center group cursor-pointer">
          <BiRepost className="w-6 h-6  text-slate-500 group-hover:text-green-500" />
          <span className="text-sm text-slate-500 group-hover:text-green-500">
            0
          </span>
        </div>
        <div
          className="flex gap-1 items-center group cursor-pointer"
          onClick={handleLikePost}>
          {isLiking && <LoadingSpinner size="sm" />}
          {!isLiked && !isLiking && (
            <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
          )}

          {isLiked && !isLiking && (
            <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
          )}
          <span
            className={`text-sm  group-hover:text-pink-500 ${
              isLiked ? 'text-pink-500' : 'text-slate-500'
            }`}>
            {notification.post.likes.length}
          </span>
        </div>
      </div>
      <div className="flex w-1/3 justify-end gap-2 items-center">
        <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default CommentActions;
