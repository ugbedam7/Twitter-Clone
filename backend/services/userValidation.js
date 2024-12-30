import { z } from 'zod';

// Define sign up validation schema with Zod
export const signUpSchema = z.object({
  username: z
    .string({
      required_error: 'Usrname is required',
      invalid_type_error: 'Username must be a string'
    })
    .min(3, 'Username must be at least 3 characters')
    .max(30, "Username can't exceed 30 characters")
    .nonempty('Username is required'),
  fullname: z
    .string({
      required_error: 'Full name is required',
      invalid_type_error: 'Fullname must be a string'
    })
    .min(1, 'Full name cannot be empty')
    .max(100, "Full name can't exceed 100 characters"),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
    .email('Invalid email format')
    .nonempty('Email is required'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(1, 'Password cannot be empty')
    .min(8, 'Password must be at least 6 characters')
    .max(50, "Password can't exceed 50 characters")
});
