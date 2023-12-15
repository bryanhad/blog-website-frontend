import { ComponentProps } from 'react'
import { Form, FormControlProps } from 'react-bootstrap'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type FormInputFieldProps = {
    register: UseFormRegisterReturn
    label?: string
    error?: FieldError
} & FormControlProps & { placeholder?: string } & ComponentProps<'input'> //we can copy the props of a normal html input!

export default function FormInputField({
    register,
    label,
    error,
    ...props
}: FormInputFieldProps) {
    return (
        <Form.Group className="mb-3" controlId={register.name + '-input'}>
            {label && <Form.Label>Post Title</Form.Label>}
            {/* we can use double bang operator to turn the error variable into a boolean */}
            <Form.Control {...register} {...props} isInvalid={!!error} />
            {/* this is a special component from react-bootstrap to showcase field's feedback like error msg. */}
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    )
}
