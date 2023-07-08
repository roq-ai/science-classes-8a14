import * as yup from 'yup';

export const studentValidationSchema = yup.object().shape({
  name: yup.string().required(),
  address: yup.string().required(),
  class: yup.string().required(),
  fees: yup.number().integer().required(),
  marks: yup.number().integer().required(),
  parent_id: yup.string().nullable(),
  organization_id: yup.string().nullable(),
});
