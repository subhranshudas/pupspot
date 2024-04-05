import { getTimestamp } from "./utils";

export async function fetchGraphQL({
  caller = "unknown",
  query,
  preview = false,
  tags,
}) {
  console.log(
    `FETCHING_GRAPHQL_DATA: ${getTimestamp()} -- ${caller} -- PREVIEW_MODE:${preview}`
  );
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Switch the Bearer token depending on whether the fetch is supposed to retrieve live
        // Contentful content or draft content
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
      // Associate all fetches for posts with an "posts" cache tag so content can
      // be revalidated or updated from Contentful on publish
      next: { tags: tags },
    }
  ).then((response) => response.json());
}
