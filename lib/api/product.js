import CONTENT_TYPE from "@/lib/content-types";
import { extractProductEntries, extractProductEntry } from "./utils";
import { fetchGraphQL } from "./fetch-graphql";

const PRODUCT_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  price
  rating
  description
`;

export async function getAllProducts(limit = 12, isDraftMode = false) {
  const gqlQuery = `
    query {
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
    tags: [CONTENT_TYPE.PRODUCT],
  });

  return extractProductEntries(products);
}

export async function getProduct(slug, isDraftMode = false) {
  const previewParam = `preview: ${isDraftMode ? "true" : "false"}`;
  const slugParam = `where:{ slug: "${slug}"}`;

  const gqlQuery = `
    query {
      productCollection(limit: 1, ${previewParam}, ${slugParam}) {
        items {
          ${PRODUCT_GRAPHQL_FIELDS}
        }
      }
    }`;

  const products = await fetchGraphQL({
    caller: `getPost(${slug})`,
    query: gqlQuery,
    preview: isDraftMode,
    tags: [CONTENT_TYPE.PRODUCT],
  });

  return extractProductEntry(products);
}
