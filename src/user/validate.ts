import * as yup from "yup";
// import { UserLoginInput, UserRegisterInput } from "./types";

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(3, "username too short")
    .max(50, "username too long"),
  email: yup.string().required().email("invalid email"),
  firstName: yup.string(),
  lastName: yup.string(),
  password: yup.string().required().min(4, "password too short")
});

const validateRegister = async (value: any) => {
  try {
    await registerSchema.validate(value, { abortEarly: false });
    return null;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.inner.map(e => ({
        field: e.path ?? "none",
        message: e.errors[0]
      }));
    }

    throw err;
  }
};

const loginSchema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required()
});

const validateLogin = async (value: any) => {
  try {
    await loginSchema.validate(value, { abortEarly: false });
    return null;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.inner.map(e => ({
        field: e.path ?? "none",
        message: e.errors[0]
      }));
    }

    throw err;
  }
};

export { validateLogin, validateRegister };
