import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getParentById, updateParentById } from 'apiSdk/parents';
import { Error } from 'components/error';
import { parentValidationSchema } from 'validationSchema/parents';
import { ParentInterface } from 'interfaces/parent';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { StudentInterface } from 'interfaces/student';
import { getStudents } from 'apiSdk/students';

function ParentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ParentInterface>(
    () => (id ? `/parents/${id}` : null),
    () => getParentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ParentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateParentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/parents');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ParentInterface>({
    initialValues: data,
    validationSchema: parentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Parent
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="login_details" mb="4" isInvalid={!!formik.errors?.login_details}>
              <FormLabel>Login Details</FormLabel>
              <Input
                type="text"
                name="login_details"
                value={formik.values?.login_details}
                onChange={formik.handleChange}
              />
              {formik.errors.login_details && <FormErrorMessage>{formik.errors?.login_details}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<StudentInterface>
              formik={formik}
              name={'student_id'}
              label={'Select Student'}
              placeholder={'Select Student'}
              fetcher={getStudents}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'parent',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ParentEditPage);
