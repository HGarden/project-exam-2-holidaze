import * as yup from "yup";

export const RegisterSchema = yup.object().shape({
  name: yup.string().min(3).required(),
  email: yup
    .string()
    .email("Invalid email")
    .required()
    .matches(/@(stud\.noroff\.no|noroff\.no)$/),
  password: yup.string().min(6).required(),
});
