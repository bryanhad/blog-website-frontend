import { Button, ButtonProps, Spinner } from 'react-bootstrap'

type LoadingButtonProps = {
    isLoading: boolean
    children: React.ReactNode
} & ButtonProps

export default function LoadingButton({
    isLoading,
    children,
    ...props
}: LoadingButtonProps) {
    return (
        <Button {...props}>
            {isLoading && (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="visually-hidden">Loading...</span>
                    {' '}
                </>
            )}
            {children}
        </Button>
    )
}
