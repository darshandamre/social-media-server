import * as yup from "yup";
import { createValidator } from "../utils/createValidator";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .trim()
    .matches(/^[a-zA-Z0-9_]*$/, {
      message: "username can only contain letters, numbers and '_'"
    })
    .min(3, "must be more that 3 characters")
    .max(15, "must be less then 15 characters"),
  email: yup.string().required().trim().email("invalid email"),
  name: yup.string().trim().max(50, "name can't be more than 50 characters"),
  password: yup.string().required().min(4, "password too short")
});

const loginSchema = yup.object().shape({
  email: yup.string().required().trim().email("invalid email"),
  password: yup.string().required()
});

export const validateRegister = createValidator(registerSchema);
export const validateLogin = createValidator(loginSchema);
