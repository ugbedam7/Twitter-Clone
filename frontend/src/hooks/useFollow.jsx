import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useFollow = () => {
  const queryQlient = useQueryClient();

  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/${userId}/follow`, {
          method: 'POST',
          credentials: 'include'
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Something went wrong!');
        }

        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },

    onSuccess: (result) => {
      toast.success(result.message);
      Promise.all([
        queryQlient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryQlient.invalidateQueries({ queryKey: ['authUser'] })
      ]);
    },

    onError: (error) => {
      toast.error(error.message);
    }
  });

  return { follow, isPending };
};

export default useFollow;
