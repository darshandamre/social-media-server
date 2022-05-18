import { BaseSchema, ValidationError } from "yup";

export const createValidator =
  <T extends BaseSchema>(schema: T) =>
  async (value: any) => {
    try {
      const castValues = await schema.validate(value, {
        abortEarly: false
      });
      return { castValues };
    } catch (err) {
      if (err instanceof ValidationError) {
        return {
          errors: err.inner.map(e => ({
            field: e.path,
            message: e.errors[0]
          }))
        };
      }

      throw err;
    }
  };
