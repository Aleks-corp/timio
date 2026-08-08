import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup.string().trim().required("Вкажіть імʼя"),
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Введіть коректний email")
    .required("Вкажіть email"),
  password: yup
    .string()
    .min(8, "Пароль має містити від 8 до 72 символів")
    .max(72, "Пароль має містити від 8 до 72 символів")
    .required("Вкажіть пароль"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Паролі не збігаються")
    .required("Підтвердіть пароль"),
});

export type SignUpFormValues = yup.InferType<typeof signUpSchema>;

export const signInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Введіть коректний email")
    .required("Вкажіть email"),
  password: yup.string().required("Вкажіть пароль"),
});

export type SignInFormValues = yup.InferType<typeof signInSchema>;
