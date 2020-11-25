import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import createApp from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const shopOrigin = router.query.shop || "shopOrigin";
  const app = createApp({
    apiKey: API_KEY,
    shopOrigin: shopOrigin,
    forceRedirect: true,
  });
  const link = new createHttpLink({
    credentials: "omit",
    fetch: authenticatedFetch(app), // app: App Bridge instance
  });
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache(),
  });

  return (
    <AppProvider i18n={translations}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </AppProvider>
  );
}
