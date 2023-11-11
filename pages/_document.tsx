import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script async src="https://analytics.eu.umami.is/script.js" data-website-id="587e1a93-6ec8-4d38-a075-43faed565ab1"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
