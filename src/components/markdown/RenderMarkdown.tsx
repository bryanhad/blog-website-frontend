import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import styles from './Markdown.module.css'

// remarkGfm is for markdown like github
// remarkToc is for creating table of contents and each is a link! updates the url
// rehypeSlug is for us to be able to navigate when we click the headings and append it to our url, and will 

type RenderMarkdown = {
    children: string
}

export default function RenderMarkdown({ children }: RenderMarkdown) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkToc, { maxDepth: 3, tight:true }]]} //for adding plugins
            rehypePlugins={[rehypeSlug]} // enable us to go to the heading based on the Url!
            components={{
              img: (props) => ( //props are the markdown element's props object it will be passwed here
                <span className={styles.imageWrapper}>
                  <a href={props.src} target='_blank' rel='noreferrer'>
                    <img //linter is mad cuz we ain't using nextImage.. but its okay i guess..
                      {...props}
                      alt={props.alt ?? ''}
                    />
                  </a>
                </span>
              )
            }}
        >
            {children}
        </ReactMarkdown>
    )
}
