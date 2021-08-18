import Document, { Html, Head, Main, NextScript } from 'next/document'
import { NewRelicSnippet } from '../components/NRSnippet'

export default class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <NewRelicSnippet accountId={`${process.env.NEW_RELIC_RUM_ACCOUNT_ID}`} applicationId={`${process.env.NEW_RELIC_RUM_APPLICATION_ID}`} licenseKey={`${process.env.NEW_RELIC_RUM_INGEST_KEY}`} host={`${process.env.NEW_RELIC_RUM_HOST}`} ></NewRelicSnippet>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}


