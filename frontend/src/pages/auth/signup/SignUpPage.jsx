import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import XSvg from '../../../components/svgs/X';
import { MdOutlineMail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdPassword } from 'react-icons/md';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

let result = null;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullname: '',
    password: ''
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullname, password }) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            username,
            fullname,
            password
          })
        });
        result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Error creating account!');
        }

        setFormData({
          email: '',
          username: '',
          fullname: '',
          password: ''
        });

        return result;
      } catch (err) {
        console.error(err.message);
        toast.error(err.message);
        throw err;
      }
    },
    onSuccess: () => {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
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
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}>
          <XSvg className="w-24 fill-white lg:hidden" />
          <h1 className="text-4xl font-extrabold text-white">Join Today</h1>

          <label className="input input-bordered flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered flex items-center gap-2 flex-1">
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
            <label className="input input-bordered flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                onChange={handleInputChange}
                name="fullname"
                value={formData.fullname}
              />
            </label>
          </div>
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
              'Sign Up'
            )}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4 lg:w-2/3">
          <p className="text-lg text-white">Already have an account?</p>
          <Link to={'/login'}>
            <button className="btn rounded-full btn-primary w-full text-white btn-outline">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
