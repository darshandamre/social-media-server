import * as yup from "yup";

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
  name: yup.string().trim(),
  password: yup.string().required().min(4, "password too short")
});

const validateRegister = async (value: any) => {
  try {
    const castValues = await registerSchema.validate(value, {
      abortEarly: false
    });
    return { castValues };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return {
        errors: err.inner.map(e => ({
          field: e.path ?? "none",
          message: e.errors[0]
        }))
      };
    }

    throw err;
  }
};

const loginSchema = yup.object().shape({
  email: yup.string().required().trim().email("invalid email"),
  password: yup.string().required()
});

const validateLogin = async (value: any) => {
  try {
    const castValues = await loginSchema.validate(value, { abortEarly: false });
    return { castValues };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return {
        errors: err.inner.map(e => ({
          field: e.path ?? "none",
          message: e.errors[0]
        }))
      };
    }

    throw err;
  }
};

export { validateLogin, validateRegister };
