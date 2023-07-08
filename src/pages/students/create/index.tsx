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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createStudent } from 'apiSdk/students';
import { Error } from 'components/error';
import { studentValidationSchema } from 'validationSchema/students';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ParentInterface } from 'interfaces/parent';
import { OrganizationInterface } from 'interfaces/organization';
import { getParents } from 'apiSdk/parents';
import { getOrganizations } from 'apiSdk/organizations';
import { StudentInterface } from 'interfaces/student';

function StudentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StudentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStudent(values);
      resetForm();
      router.push('/students');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StudentInterface>({
    initialValues: {
      name: '',
      address: '',
      class: '',
      fees: 0,
      marks: 0,
      parent_id: (router.query.parent_id as string) ?? null,
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: studentValidationSchema,
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
            Create Student
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="address" mb="4" isInvalid={!!formik.errors?.address}>
            <FormLabel>Address</FormLabel>
            <Input type="text" name="address" value={formik.values?.address} onChange={formik.handleChange} />
            {formik.errors.address && <FormErrorMessage>{formik.errors?.address}</FormErrorMessage>}
          </FormControl>
          <FormControl id="class" mb="4" isInvalid={!!formik.errors?.class}>
            <FormLabel>Class</FormLabel>
            <Input type="text" name="class" value={formik.values?.class} onChange={formik.handleChange} />
            {formik.errors.class && <FormErrorMessage>{formik.errors?.class}</FormErrorMessage>}
          </FormControl>
          <FormControl id="fees" mb="4" isInvalid={!!formik.errors?.fees}>
            <FormLabel>Fees</FormLabel>
            <NumberInput
              name="fees"
              value={formik.values?.fees}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('fees', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.fees && <FormErrorMessage>{formik.errors?.fees}</FormErrorMessage>}
          </FormControl>
          <FormControl id="marks" mb="4" isInvalid={!!formik.errors?.marks}>
            <FormLabel>Marks</FormLabel>
            <NumberInput
              name="marks"
              value={formik.values?.marks}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('marks', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.marks && <FormErrorMessage>{formik.errors?.marks}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<ParentInterface>
            formik={formik}
            name={'parent_id'}
            label={'Select Parent'}
            placeholder={'Select Parent'}
            fetcher={getParents}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.login_details}
              </option>
            )}
          />
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
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
    entity: 'student',
    operation: AccessOperationEnum.CREATE,
  }),
)(StudentCreatePage);
