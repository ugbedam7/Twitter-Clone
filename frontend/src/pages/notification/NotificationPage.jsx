import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Gear } from '../../components/svgs/Gear';
import { FaUser } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa6';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { formatPostDate } from '../../utils/date/date';

const getComment = (notification) => {
  const comment = notification.post.comments.find(
    (comment) => comment.user.toString() === notification.from._id.toString()
  );

  if (comment) return comment.text; // Extract the text of the comment
};

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

  console.log(notifications);

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

  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4">
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

        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <LoadingSpinner size="lg" />
          </div>
        )}
        {notifications?.length === 0 && (
          <div className="text-center p-4 font-bold">No notifications 🤔</div>
        )}
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
              <Link to={`/profile/${notification.from.username}`}>
                {notification.type !== 'comment' && (
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={
                          notification.from.profileImg ||
                          '/avatar-placeholder.png'
                        }
                      />
                    </div>
                  </div>
                )}
                {notification.type === 'comment' ? (
                  <>
                    <div className="comment">
                      <div className="flex gap-2">
                        <span className="font-bold text-white">
                          {notification.from.fullname}
                        </span>
                        <span className="font-normal text-gray-500">
                          @{notification.from.username}
                        </span>{' '}
                        <span>.</span>{' '}
                        <span>{formatPostDate(notification.createAt)}</span>
                      </div>
                      <p className="text-gray-500">
                        Replying to{' '}
                        <span className="text-blue-500 mt-2">
                          @{notification.to.username}
                        </span>
                      </p>
                    </div>

                    {notification.post && (
                      <div className="comment">
                        <p className="text-gray-100 mt-3">
                          {getComment(notification)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex gap-1">
                      <span className="font-bold">
                        @{notification.from.username}
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
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default NotificationPage;
