import { ComponentProps } from 'react'
import { Form, FormControlProps, InputGroup } from 'react-bootstrap'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

type FormInputFieldProps = {
    register: UseFormRegisterReturn
    label?: string
    error?: FieldError
    inputGroupElement?: JSX.Element
} & FormControlProps & { placeholder?: string } & ComponentProps<'input'> //we can copy the props of a normal html input!

export default function FormInputField({
    register,
    label,
    error,
    inputGroupElement,
    ...props
}: FormInputFieldProps) {
    return (
        <Form.Group className="mb-3" controlId={register.name + '-input'}>
            {label && <Form.Label>{label}</Form.Label>}

            <InputGroup hasValidation>
                {/* we can use double bang operator to turn the error variable into a boolean */}
                <Form.Control 
                    {...register} 
                    {...props} 
                    isInvalid={!!error} 
                    aria-describedby={inputGroupElement?.props.id} //connects the input group element belongs to this form field..
                />
                {/* this is a special component from react-bootstrap to showcase field's feedback like error msg. */}
                {inputGroupElement}
                <Form.Control.Feedback type="invalid">
                    {error?.message}
                </Form.Control.Feedback>
            </InputGroup>
        </Form.Group>
    )
}
