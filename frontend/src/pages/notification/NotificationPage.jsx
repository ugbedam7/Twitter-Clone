import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Gear } from '../../components/svgs/Gear';
import { FaTrash, FaUser } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { formatPostDate } from '../../utils/date/date';
import { getCommentText } from '../../utils/helpers/getCommentText';
import CommentActions from './CommentActions';

const NotificationPage = () => {
  const [feedType, setFeedType] = useState('all');
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/notifications', {
          method: 'GET',
          credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        return data.notifications || [];
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/notifications', {
          method: 'DELETE',
          credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: deleteNotification, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(`/api/notifications/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSettled: () => {
      // refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },

    onSuccess: (data) => {
      toast.success(data.message);

      // Directly modifying notifications query's catched data
      queryClient.setQueryData(['notifications'], (old) => {
        return old.filter(
          (notification) => notification._id !== data.notificationId
        );
      });
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen overflow-hidden">
        <div className="fixed top-0 w-[53.5%] shadow-md bg-[rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center p-4 z-10">
            <p className="font-bold text-xl">Notifications</p>
            <div className="dropdown ">
              <div tabIndex={0} role="button" className="m-1">
                <Gear className="font-bold fill-slate-100 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a onClick={deleteNotifications}>Delete all notifications</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex w-full border-b border-gray-700">
            <div
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative  ${
                feedType === 'all' ? 'text-white' : 'text-gray-500'
              }`}
              onClick={() => setFeedType('all')}>
              All
              {feedType === 'all' && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
              )}
            </div>
            <div
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative  ${
                feedType === 'verified' ? 'text-white' : 'text-gray-500'
              }`}
              onClick={() => setFeedType('verified')}>
              Verified
              {feedType === 'verified' && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
              )}
            </div>

            <div
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
                feedType === 'mentions' ? 'text-white' : 'text-gray-500'
              }`}
              onClick={() => setFeedType('mentions')}>
              Mentions
              {feedType === 'mentions' && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
              )}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {(!notifications || notifications?.length === 0) && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}

        <div className="mt-28"></div>
        {notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-2 p-4">
              {notification.type === 'follow' && (
                <FaUser className="w-7 h-7 text-primary" />
              )}
              {notification.type === 'comment' && (
                <div className="avatar">
                  <div className="h-8 rounded-full">
                    <img
                      src={
                        notification.from.profileImg ||
                        '/avatar-placeholder.png'
                      }
                    />
                  </div>
                </div>
              )}

              {notification.type === 'like' && (
                <FaHeart className="w-7 h-7 text-pink-500" />
              )}

              <div className="comment-section">
                {notification.type === 'comment' ? (
                  <div className="comment flex-1">
                    <div className="flex gap-2">
                      <Link to={`/profile/${notification.from.username}`}>
                        <span className="font-bold text-white pr-1">
                          {notification.from.fullname}
                        </span>
                        <span className="font-normal text-gray-500 ">
                          @{notification.from.username}
                        </span>
                      </Link>
                      <span>.</span>{' '}
                      <span>{formatPostDate(notification.createdAt)}</span>
                    </div>
                    <p className="text-gray-500">
                      Replying to{' '}
                      <Link to={`/profile/${notification.to.username}`}>
                        <span className="text-blue-500 mt-2">
                          @{notification.to.username}
                        </span>
                      </Link>
                    </p>

                    {notification.post && (
                      <div className="text">
                        <p className="text-gray-100 mt-3">
                          {getCommentText(notification)}
                        </p>
                      </div>
                    )}

                    <div className="comment-actions">
                      <CommentActions notification={notification} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-1">
                      <span className="font-bold">
                        <Link to={`/profile/${notification.from.username}`}>
                          @{notification.from.username}
                        </Link>
                      </span>{' '}
                      {notification.type === 'follow'
                        ? 'followed you'
                        : 'liked your post'}
                    </div>

                    {notification.post && (
                      <div className="post">
                        <p className="text-gray-500 mt-3">
                          {notification.post.text}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
              <span className="flex justify-end flex-1">
                {!isDeleting ? (
                  <FaTrash
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => deleteNotification(notification._id)}
                  />
                ) : (
                  <LoadingSpinner size="sm" />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
