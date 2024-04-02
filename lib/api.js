// Set a variable that contains all the fields needed for articles when a fetch for
// content is performed
const POST_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  image {
    url
    width
    height
    description
  }
  category {
    title
    slug
  }
  body {
    json
  }
`;

async function fetchGraphQL(query, preview = false) {
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
      next: { tags: ["posts"] },
    }
  ).then((response) => response.json());
}

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items;
}

export async function getAllPosts(
  // For this demo set the default limit to always return 12 articles.
  limit = 12,
  // By default this function will return published content but will provide an option to
  // return draft content for reviewing articles before they are live
  isDraftMode = false
) {
  const posts = await fetchGraphQL(
    `query {
        postCollection(limit: ${limit}, preview: ${
      isDraftMode ? "true" : "false"
    }) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
    isDraftMode
  );

  return extractPostEntries(posts);
}

export async function getPost(slug, isDraftMode = false) {
  const article = await fetchGraphQL(
    `query {
        postCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
      isDraftMode ? "true" : "false"
    }) {
          items {
            ${POST_GRAPHQL_FIELDS}
          }
        }
      }`,
    isDraftMode
  );
  return extractPostEntries(article)[0];
}
