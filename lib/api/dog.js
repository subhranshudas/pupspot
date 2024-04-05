import CONTENT_TYPE from "@/lib/content-types";
import { extractDogEntries, extractDogEntry } from "./utils";
import { fetchGraphQL } from "./fetch-graphql";

const DOG_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  subtitle
  slug
  image {
    url
    width
    height
    description
  }
  age
  description
`;

export async function getAllDogs(limit = 12, isDraftMode = false) {
  const gqlQuery = `query {
    dogCollection(limit: ${limit}, preview: ${isDraftMode ? "true" : "false"}) {
        items {
          ${DOG_GRAPHQL_FIELDS}
        }
      }
    }`;

  const posts = await fetchGraphQL({
    caller: "getAllDogs",
    query: gqlQuery,
    preview: isDraftMode,
    tags: [CONTENT_TYPE.DOG],
  });

  return extractDogEntries(posts);
}

export async function getDog(slug, isDraftMode = false) {
  const gqlQuery = `query {
      dogCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
    isDraftMode ? "true" : "false"
  }) {
        items {
          ${DOG_GRAPHQL_FIELDS}
        }
      }
    }`;

  const dogs = await fetchGraphQL({
    caller: `getPost(${slug})`,
    query: gqlQuery,
    preview: isDraftMode,
    tags: [CONTENT_TYPE.DOG],
  });
  return extractDogEntry(dogs);
}
