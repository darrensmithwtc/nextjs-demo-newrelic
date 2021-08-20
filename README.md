# Example Integration for NextJS and New Relic

The example integration comes in two forms;

- APM - To get performance statistics for node based Server Side Rendering.
- BROWSER (RUM) - To get Real User Telemetry directly from Clients Browsers.

## Environment Variables

In order to get it to run locally you need to modify the package.json docker environment variables or create a .env.local file with the following variables in;

APM Agent Environment Variables:

```
NEW_RELIC_NO_CONFIG_FILE=true                   # If not set, these settings will need to be in a newrelic.js instead.
NEW_RELIC_LOG_ENABLED=false                     # To stop newrelic_agent.log being generated inside the containers.
NEW_RELIC_APP_NAME=[your app name]              # Remember this will need to change per environment we deploy to!
NEW_RELIC_LICENSE_KEY=[licence key]             # This is the main licence key for your New Relic Account.
```

Browser Snippet Environment Variables:

```
NEW_RELIC_RUM_ACCOUNT_ID=[accountid]            # This is the Account ID that you wish to report RUM metrics to
NEW_RELIC_RUM_INGEST_KEY=[ingestKey]            # This is the specific ingest key created during the Browser Setup in New Relic
NEW_RELIC_RUM_APPLICATION_ID=[applicationId]    # This is the specific Application ID created by New Relic
NEW_RELIC_RUM_HOST=[ingest_hostname]            # This is the datacenter specific
```

Container Port Variables:

```
PORT=3000                                       # The port the local-server runs on.
```

Whilst this example uses environment variables for config management, other alternatives are available ;-)

## Whats Included?

### Custom Server

- Server Side Rendering (APM)
  - In order to get performance information from the NextJS's Express Application for SSR, we need to include the NewRelic NPM Package in the project and include it at the start of the custom server.
- Categorisation of Requests
  - By default with the express/nextjs wrapper there is no concept of categorisation of request types, which will mean New Relic will group everything into one transaction type and potentially could cause metric grouping issues if there are a large number of URI's on the site.
  - We therefore need to extend the custom server with a way of categorising these requests.
- Custom Attributes
  - In order to better find out what is going on with with a particular user, we need to tell New Relic about additional meta-data for the request. An example included is JSESSIONID or ipAddr but we should look at userId's etc as well.

### Browser Snippet

- Real User Monitor (Browser)

  - Due to the way NextJS manages rendering the pages, we cannot use the NodeJS agent to automatically add Browser Tags in the pages automatically. Therefore the recommended approach is to create a NRSnippet Component (the loader config included in the page changes very infrequently) in a parametertised way to cater with different environments.
  - If you are unable to parameterise these tokens per environment, then ALL environments will report to the same application in New Relic.
  - New Relic requires a Browser Application be setup in their UI or using the restAPI in order to create the values for the above.

- Custom Attributes / Other API Snippets

  - Just like APM, we can add customAttributes to augment the requests with additional metadata, such as userId's, pageTypes etc.
  - We can also use tag managers to augment the pages as attributes will stay assigned to that session whilst page transitions occur.

- Sessions and Funnels
  - By Default we should be DISABLING 3rd Party Cookies as part of the New Relic Browser setup, to avoid hitting issues with Cookie Policies.
  - However, that means we need to EITHER include a [session] attribute via way of the SPA or Tag Manager in order to give us the ability to track sessions and provider funnels.

# New Relic Documentation

- [NodeJS API](https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides/nodejs-agent-api/)
- [Browser/SPA API](https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/)
