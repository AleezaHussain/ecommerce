import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import { cache } from '@emotion/css';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage;
    const emotionServer = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          emotionServer.extractCriticalToChunks(<App {...props} />),
        enhanceComponent: (Component) => {
          return Component;
        },
      });

    const initialProps = await Document.getInitialProps(ctx);

    const emotionStyles = emotionServer.getInsertedStyles();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion={`inserted ${emotionStyles.join(' ')}`}
            dangerouslySetInnerHTML={{
              __html: emotionStyles.map((key) => cache.sheet.tags.find((tag) => tag.key === key)?.textContent).join(''),
            }}
          />
        </>
      ),
    };
  }
}

export default MyDocument;
