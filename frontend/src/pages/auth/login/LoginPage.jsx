import { useState } from 'react';
import { Link } from 'react-router-dom';
import XSvg from '../../../components/svgs/X';
import { MdPassword } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

let result = null;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        });

        result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Login error');
        }

        setFormData({
          username: '',
          password: ''
        });
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success(result.message);
      // Refetch the authUser
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex  gap-4 flex-col"
          onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <XSvg className="w-24 fill-white lg:hidden" />
          </div>

          <h1 className="text-center text-4xl font-extrabold text-white">
            {"Let's"} Go.
          </h1>

          <label className="input input-bordered flex items-center gap-2">
            <FaUser />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            {isPending ? (
              <span className="flex justify-center items-center">
                <img src="/spinner.gif" alt="spinner" height={25} width={25} />
              </span>
            ) : (
              'Login'
            )}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4 lg:w-2/3">
          <p className="text-lg text-white">{"Don't"} have an account?</p>
          <Link to={'/signup'}>
            <button className="btn rounded-full btn-primary w-full text-white btn-outline">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
