import { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import FormInputField from './FormInputField'
import { Button, FormControlProps } from 'react-bootstrap'
import { ComponentProps, useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

type FormInputFieldProps = {
    register: UseFormRegisterReturn
    label?: string
    error?: FieldError
} & FormControlProps & { placeholder?: string } & ComponentProps<'input'> //we can copy the props of a normal html input!

export default function PasswordInputField({
    register,
    label,
    error,
    ...props
}: FormInputFieldProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div>
            <FormInputField
                register={register}
                label={label}
                error={error}
                {...props}
                type={showPassword ? 'text' : 'password'}
                inputGroupElement={
                    <Button
                        variant="secondary"
                        className="d-flex align-items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                        id={register.name + '-toggle-visibility-button'}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                }
            />
        </div>
    )
}
