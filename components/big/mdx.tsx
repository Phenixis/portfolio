import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'

let ids: string[] = []

function Table({ data }: { data: any }) {
	let headers = data.headers.map((header: any, index: any) => (
		<th key={index}>{header}</th>
	))
	let rows = data.rows.map((row: any, index: any) => (
		<tr key={index}>
			{row.map((cell: any, cellIndex: any) => (
				<td key={cellIndex}>{cell}</td>
			))}
		</tr>
	))

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	)
}

function CustomLink(props: any) {
	let href = props.href

	if (href.startsWith('/')) {
		return (
			<Link href={href} {...props}>
				{props.children}
			</Link>
		)
	}

	if (href.startsWith('#')) {
		return <a {...props} />
	}

	return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props: any) {
	return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }: { children: string }) {
	let codeHTML = highlight(children)
	return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string) {
	return str
		.toString()
		.toLowerCase()
		.trim() // Remove whitespace from both ends of a string
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
}

function createHeading(level: number) {
	const Heading = ({ children }: { children: string }) => {
		let slug = slugify(children)
		let id = slug

		let counter = 1
		while (ids.includes(id)) {
			id = `${slug}-${counter}`
			counter++
		}
		ids.push(id)

		return React.createElement(
			`h${level}`,
			{ id: id, className:`target:border-l-2 target:pl-2` },
			[
				React.createElement('a', {
					href: `#${id}`,
					key: `link-${id}`,
					className: 'anchor',
				}),
			],
			children
		)
	}

	Heading.displayName = `Heading${level}`

	return Heading
}

let components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	Image: RoundedImage,
	a: CustomLink,
	code: Code,
	Table,
}

export function CustomMDX(props: React.JSX.IntrinsicAttributes & MDXRemoteProps) {
	ids = [];

	return (
		<MDXRemote
			{...props}
			components={{ ...components, ...(props.components || {}) }}
		/>
	)
}
