import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters.')
});

// ValidateLogin middleware checks that req.body adheres to the schema
// but doesn't transform or remove the data.

export const validateLogin = (req, res, next) => {
  try {
    // Validate and parse the request body
    const validatedData = loginSchema.parse(req.body);

    req.validatedBody = validatedData; // Attach validated data to req
    next(); // Proceed to the controller if validation succeeds
  } catch (err) {
    return res.status(400).json({ error: err.errors.map((e) => e.message) });
  }
};
