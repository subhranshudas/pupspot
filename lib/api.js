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
  age
  category {
    title
    slug
  }
  body {
    json
  }
`;

const PRODUCT_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  price
`;

function getTimestamp() {
  const now = new Date(Date.now());

  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return now.toLocaleString("en-US", options);
}

async function fetchGraphQL({
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

function extractPostEntries(fetchResponse) {
  return fetchResponse?.data?.postCollection?.items;
}

function extractProductEntries(fetchResponse) {
  return fetchResponse?.data?.productCollection?.items;
}

export async function getAllPosts(
  // For this demo set the default limit to always return 12 articles.
  limit = 12,
  // By default this function will return published content but will provide an option to
  // return draft content for reviewing articles before they are live
  isDraftMode = false
) {
  const gqlQuery = `query {
    postCollection(limit: ${limit}, preview: ${
    isDraftMode ? "true" : "false"
  }) {
      items {
        ${POST_GRAPHQL_FIELDS}
      }
    }
  }`;

  const posts = await fetchGraphQL({
    caller: "getAllPosts",
    query: gqlQuery,
    preview: isDraftMode,
    tags: ["posts"],
  });

  return extractPostEntries(posts);
}

export async function getPost(slug, isDraftMode = false) {
  const gqlQuery = `query {
    postCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
    isDraftMode ? "true" : "false"
  }) {
      items {
        ${POST_GRAPHQL_FIELDS}
      }
    }
  }`;

  const article = await fetchGraphQL({
    caller: `getPost(${slug})`,
    query: gqlQuery,
    preview: isDraftMode,
  });
  return extractPostEntries(article)[0];
}

export async function getAllProducts(
  // For this demo set the default limit to always return 12 articles.
  limit = 12,
  // By default this function will return published content but will provide an option to
  // return draft content for reviewing articles before they are live
  isDraftMode = false
) {
  const gqlQuery = `query {
    productCollection(limit: ${limit}, preview: ${
    isDraftMode ? "true" : "false"
  }) {
      items {
        ${PRODUCT_GRAPHQL_FIELDS}
      }
    }
  }`;

  const products = await fetchGraphQL({
    caller: "getAllProducts",
    query: gqlQuery,
    preview: isDraftMode,
    tags: ["products"],
  });

  return extractProductEntries(products);
}
