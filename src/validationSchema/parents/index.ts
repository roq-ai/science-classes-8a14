import * as yup from 'yup';

export const parentValidationSchema = yup.object().shape({
  login_details: yup.string().required(),
  student_id: yup.string().nullable(),
});
