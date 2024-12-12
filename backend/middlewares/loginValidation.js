import { z } from 'zod';

const loginSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(1, 'Username should not empty'),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
    .min(1, 'Username should not empty')
    .min(6, 'Password must be at least 6 characters long')
});

// ValidateLogin middleware checks that req.body adheres to the schema
// but doesn't transform or remove the data.

export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body); // Validate the request body

    const validatedData = loginSchema.parse(req.body); // Validate and parse data
    req.validatedBody = validatedData; // Attach validated data to req
    next(); // Proceed to the controller if validation succeeds
  } catch (err) {
    return res.status(400).json({ Error: err.errors.map((e) => e.message) });
  }
};
