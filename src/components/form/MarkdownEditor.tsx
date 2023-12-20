import dynamic from 'next/dynamic'
import { Form } from 'react-bootstrap'
import {
    FieldError,
    UseFormRegisterReturn,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form'
import Markdown from 'react-markdown'
import * as BlogApi from '@/network/api/blog'
import RenderMarkdown from '../RenderMarkdown'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

type MarkdownEditorProps = {
    register: UseFormRegisterReturn
    label?: string
    error?: FieldError
    watch: UseFormWatch<any>
    setValue: UseFormSetValue<any>
    editorHeight?: number
}

export default function MarkdownEditor({
    register,
    label,
    error,
    watch,
    setValue,
    editorHeight = 500,
}: MarkdownEditorProps) {

    async function uploadInBlogImage(image: File) {
        try {
            const res = await BlogApi.uploadInBlogImage(image)
            return res.imageUrl
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    return (
        <Form.Group className="mb-3">
            {label && (
                // we have to use register.name + '-input_md' because that's just what markdown editor do..
                // it adds the _md to the end of the id..
                <Form.Label htmlFor={register.name + '-input_md'}>
                    {label}
                </Form.Label>
            )}
            <MdEditor
                {...register}
                style={{ height: `${editorHeight}px` }}
                renderHTML={(text) => <RenderMarkdown>{text}</RenderMarkdown>}
                id={register.name + '-input'}
                value={watch(register.name)} //this is to get the current value of the input in react-hook-form based on the name passed.
                onChange={({ text }) => {
                    setValue(register.name, text, {
                        //this is just handling the setValue's react-hook-form manually.. cuz we are not using react's form control are we?? we are using a bloody other package for this input!
                        shouldValidate: true,
                        shouldDirty: true,
                    }) //react form will now know that the user 'touched' the input form, and we can show a worning if the user decides to close the window while writing on the field.
                }}
                className={error ? 'is-invalid' : ''}
                onImageUpload={uploadInBlogImage} //this props will call a uploadFunc which is a async function that will return the Url string
                imageAccept='.jpg,.png'
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    )
}
