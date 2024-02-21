import { DocumentProps, Head, Html, Main, NextScript } from 'next/document';

import i18nextConfig from '../next-i18next.config';

type Props = DocumentProps & {
  // add custom document props
};

export default function Document(props: Props) {
  const currentLocale =
    props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;
  return (
    <Html lang={currentLocale}>
      <Head>
        <script async src="https://analytics.eu.umami.is/script.js" data-website-id="587e1a93-6ec8-4d38-a075-43faed565ab1"></script>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PPQ"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}