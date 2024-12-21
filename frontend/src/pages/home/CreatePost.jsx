import { CiImageOn } from 'react-icons/ci';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

let result = null;

const CreatePost = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  // imgRef is initialized as an empty container ({ current: null }).
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ text, img })
        });

        result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Something went wrong');
        }
        return result.data;
      } catch (error) {
        throw new Error(error);
      }
    },

    onSuccess: () => {
      setText('');
      setImg(null);
      imgRef.current.value = null;
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser.profileImg || '/avatar-placeholder.png'} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            // Assigns the DOM node of the input element to imgRef.current
            // imgRef.current now points to the <input> element in the DOM
            ref={imgRef} //imgRef.current references the element it's attached to.
            onChange={handleImgChange}
          />
          <button className="btn btn-primary rounded-full btn-sm text-white px-4">
            {isPending ? (
              <span className="flex justify-center items-center">
                <img src="/spinner.gif" alt="spinner" height={20} width={20} />
              </span>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

/**
 * Why Use useRef Here?
 * 1.Avoiding Re-renders: Unlike state, updating a ref does not cause the
 * component to re-render. This makes it an efficient way to interact with
 * the DOM for tasks like file input.
 * 
 * 2.Direct DOM Manipulation: React provides an abstraction over the DOM, but
 * useRef allows you to directly access and manipulate a DOM node when need
 * (e.g., triggering a click event programmatically).
 * 
 * 3.Clean Separation of UI and Logic: Using a ref keeps the <input> hidden
 * while allowing another UI element (like the icon) to handle user
 * interactions.

*/
