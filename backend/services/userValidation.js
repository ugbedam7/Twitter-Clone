import Joi from 'joi';
import { z } from 'zod';

// Define Profile validation schema with Joi
export const validateUpdateProfile = (data) => {
  const schema = Joi.object({
    fullname: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30),
    currentPassword: Joi.string(),
    newPassword: Joi.string().min(6).when('currentPassword', {
      is: Joi.exist(),
      then: Joi.required()
    }),
    bio: Joi.string().max(160),
    link: Joi.string().uri(),
    profileImg: Joi.string(),
    coverImg: Joi.string()
  }).with('currentPassword', 'newPassword');

  return schema.validate(data, { abortEarly: false });
};

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
