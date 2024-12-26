import Head from 'next/head';
import Link from 'next/link';

import { SideNav, TableOfContents, TopNav } from '../components';

import 'prismjs';
// Import other Prism themes here
import 'prismjs/components/prism-bash.min';
import 'prismjs/themes/prism.css';

import '../public/globals.css'

import type { AppProps } from 'next/app'
import type { MarkdocNextJsPageProps } from '@markdoc/next.js'
import { RenderableTreeNodes, Tag } from '@markdoc/markdoc';

const TITLE = 'Markdoc';
const DESCRIPTION = 'A powerful, flexible, Markdown-based authoring framework';

interface Config {
  sidebar: Section[];
}

import { TableOfContentsItem } from '../components/TableOfContents';

interface Link {
  href: string;
  title: string;
}

interface Section {
  heading: string;
  links: Link[];
}

function collectHeadings(node: RenderableTreeNodes, sections: TableOfContentsItem[] = []) {
  if (Tag.isTag(node)) {
    if (node.name === 'Heading') {
      const title = node.children[0];

      const id = node.attributes.id || "ham" // Assuming you have an ID generator
      const level = node.attributes.level || 1; // Delsfault to level 1 if not provided

      if (typeof title === 'string') {
        sections.push({
          id,
          level,
          title
        });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        collectHeadings(child, sections);
      }
    }
  }

  return sections;
}
import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

export type MyAppProps = MarkdocNextJsPageProps

export default function MyApp({ Component, pageProps }: AppProps<MyAppProps>) {
  const { markdoc } = pageProps;
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch('/luma.yaml');
      const text = await res.text();
      const data = yaml.load(text) as Config;
      setConfig(data);
    };

    fetchConfig();
  }, []);

  let title = TITLE;
  let description = DESCRIPTION;
  if (markdoc) {
    if (markdoc.frontmatter.title) {
      title = markdoc.frontmatter.title;
    }
    if (markdoc.frontmatter.description) {
      description = markdoc.frontmatter.description;
    }
  }

  const toc = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : [];


  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="referrer" content="strict-origin" />
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TopNav>
        <Link href="/docs">Docs</Link>
      </TopNav>
      <div className="page">
        <SideNav items={config?.sidebar || []} />
        <main className="flex column">
          <Component {...pageProps} />
        </main>
        <TableOfContents toc={toc} />
      </div>
      <style jsx>
        {`
          .page {
            position: fixed; 
            top: var(--top-nav-height);
            display: flex;
            width: 100vw;
            flex-grow: 1;
          }
          main {
            overflow: auto;
            height: calc(100vh - var(--top-nav-height));
            flex-grow: 1;
            font-size: 16px;
            padding: 0 2rem 2rem;
          }
        `}
      </style>
    </>
  );
}
