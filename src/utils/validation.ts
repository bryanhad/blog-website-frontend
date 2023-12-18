import * as yup from 'yup'

export const requiredStringSchema = yup.string().required('Required')

export const usernameSchema = yup
    .string()
    .max(20, 'Must be 20 characters or less')
    .matches(
        /^[a-zA-Z0-9_]*$/,
        'Only letters, numbers, and underscores are allowed'
    )

export const emailSchema = yup
    .string()
    .email('Please ented a valid email address')

export const passwordSchema = yup
    .string()
    .matches(/^(?!.* )/, 'Must not contain any whitespaces')
    .min(8, 'Must be at least 8 characters long')

export const slugSchema = yup
    .string()
    .matches(/^[a-zA-Z0-9_-]*$/, 'No special characters or spaces allowed')

export const requiredFileSchema = yup
    .mixed<FileList>() //this is for testing sometypes that are not supported by yup
    // here, we want to test a type of FileList which is what inputField type file would return
    .test(
        'not-empty-file-list', //this is just the name for the text, not rlly improtant but required
        'Required', //the error message
        (value) => value instanceof FileList && value.length > 0
    )
    .required()
