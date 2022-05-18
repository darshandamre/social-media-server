import * as yup from "yup";
import { createValidator } from "../utils/createValidator";

const userEditSchema = yup.object().shape({
  name: yup.string().trim().max(50, "name can't be more that 50 characters"),
  bio: yup.string().trim().max(200, "bio can't be more than 200 characters"),
  portfolioLink: yup
    .string()
    .trim()
    .max(100, "portfolio link can't be more than 100 characters")
});

export const validateUserEdit = createValidator(userEditSchema);
