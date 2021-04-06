import React, {Children, FC} from 'react'
import MarkdownComponent, {MarkdownOptions} from 'markdown-to-jsx'
import {Paragraph, Heading, Text} from '../typography'
import {Link} from '../link'
import {List} from '../list'
import {styled, Box, Image} from '@qiwi/pijma-core'

export interface MarkdownProps {
  size?: 's' | 'm' | 'l'
  children: string
  overrides?: Record<string, FC<any>>
}

const MarkdownBox = styled(Box)({
  '&:nth-child(1)': {
    marginTop: 0,
  },
})

const SizeMargin: { [size in NonNullable<SizeProps['size']>]: number } = {
  s: 2,
  m: 3,
  l: 3,
}

interface SizeProps {
  size: 's' | 'm' | 'l'
}

const p: FC<SizeProps> = ({children, size}) => (
  <MarkdownBox mt={SizeMargin[size]}>
    <Paragraph size={size} children={children}/>
  </MarkdownBox>
)

interface ImageProps extends SizeProps {
  alt?: string
  src: string
}

const img: FC<ImageProps> = ({src, alt}) => (
  <Image src={src} alt={alt} width="auto" height="auto"/>
)

interface LinkProps extends SizeProps {
  title?: string
  href?: string
}

const a: FC<LinkProps> = ({title, href, size, children}) => (
  <Link
    title={title}
    href={href}
    size={size}
    children={children}
  />
)

const h1: FC<SizeProps> = ({children}) => (
  <MarkdownBox mt={6}>
    <Heading size="1" children={children}/>
  </MarkdownBox>
)

const h2: FC<SizeProps> = ({children}) => (
  <MarkdownBox mt={6}>
    <Heading size="2" children={children}/>
  </MarkdownBox>
)

const h3: FC<SizeProps> = ({children}) => (
  <MarkdownBox mt={5}>
    <Heading size="3" children={children}/>
  </MarkdownBox>
)

const h4: FC<SizeProps> = ({children}) => (
  <MarkdownBox mt={4}>
    <Heading size="4" children={children}/>
  </MarkdownBox>
)

const strong: FC<SizeProps> = ({children}) => (
  <Text bold children={children}/>
)

const del: FC<SizeProps> = ({children}) => (
  <Text decoration="line-through" children={children}/>
)

const li: FC<SizeProps> = ({size, children}) => (
  <React.Fragment>
    {React.Children.map(children, (child, i) => (
      <MarkdownBox key={i} mt={SizeMargin[size]}>
        {typeof child === 'string' ? (
          <Paragraph key={i} size={size} children={child}/>
        ) : (
          child
        )}
      </MarkdownBox>
    ))}
  </React.Fragment>
)

const ul: FC<SizeProps> = ({size, children}) => (
  <MarkdownBox mt={SizeMargin[size]}>
    <List size={size} type="bullet" children={Children.toArray(children)}/>
  </MarkdownBox>
)

interface NumericListProps extends SizeProps {
  start: number
}

const ol: FC<NumericListProps> = ({size, start, children}) => (
  <MarkdownBox mt={SizeMargin[size]}>
    <List
      size={size}
      type={start < 1000 ? 'number' : 'step'}
      children={Children.toArray(children)}
    />
  </MarkdownBox>
)

const defaultOverrides: MarkdownProps['overrides'] = {
  p,
  h1,
  h2,
  h3,
  h4,
  a,
  ul,
  ol,
  li,
  strong,
  del,
  img,
}

export const Markdown: FC<MarkdownProps> = ({size = 'm', children, overrides = {}}) => {
  const allOverrides = {...defaultOverrides, ...overrides}
  return (
    <MarkdownComponent
      children={children}
      options={{
        overrides: Object.keys(allOverrides).reduce<MarkdownOptions['overrides']>((prev, tag) => ({
          ...prev,
          ...{
            [tag]: {
              component: allOverrides[tag],
              props: {
                size,
              },
            },
          },
        }), {}),
      }}
    />
  )
}
