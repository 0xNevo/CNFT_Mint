import { ReactNode } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
          {/* Add any necessary meta tags, links, or other elements within the Head component */}
        </Head>
        <body>
          <div id="sparticlesContainer" className='' />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument;