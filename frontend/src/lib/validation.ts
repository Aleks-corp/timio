import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup.string().trim().required("Enter your name"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email")
    .required("Enter your email"),
  password: yup
    .string()
    .min(8, "Password must be between 8 and 72 characters")
    .max(72, "Password must be between 8 and 72 characters")
    .required("Enter a password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords don't match")
    .required("Confirm your password"),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

export const signInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Enter a valid email")
    .required("Enter your email"),
  password: yup.string().required("Enter your password"),
});

export type SignInFormValues = yup.InferType<typeof signInSchema>;
