import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getDog } from "@/lib/api/dog";
import { getProduct } from "@/lib/api/product";

import CONTENT_TYPE from "@/lib/content-types";

export const revalidate = 0;

export async function GET(request, { params }) {
  const { contentType } = params;

  // validate route param
  const isValidContentType = !!CONTENT_TYPE[contentType];

  if (!isValidContentType) {
    return new Response(`Invalid api route param contentType: ${contentType}`, {
      status: 400,
    });
  }

  // validate secret param
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!secret) {
    return NextResponse.json(
      { message: "Secret query param is missing." },
      { status: 400 }
    );
  }

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return NextResponse.json(
      { message: "Invalid secret query param." },
      { status: 401 }
    );
  }

  // get other params
  const slug = searchParams.get("slug");

  // enable preview mode and redirect
  let redirectPath;

  try {
    switch (contentType) {
      case CONTENT_TYPE.DOG: {
        // validate slug
        if (!slug) {
          return NextResponse.json(
            { message: "Missing Dog.slug" },
            { status: 400 }
          );
        }
        const dog = await getDog(slug, true);

        if (!dog) {
          return NextResponse.json(
            { message: "Invalid Dog.slug" },
            { status: 400 }
          );
        }

        draftMode().enable();
        redirectPath = `/dogs/${slug}`;

        break;
      }
      case CONTENT_TYPE.PRODUCT: {
        // validate slug
        if (!slug) {
          return NextResponse.json(
            { message: "Missing Product.slug" },
            { status: 400 }
          );
        }
        const product = await getProduct(slug, true);

        if (!product) {
          return NextResponse.json(
            { message: "Invalid Product.slug" },
            { status: 400 }
          );
        }

        draftMode().enable();
        redirectPath = `/products/${slug}`;

        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Error enabling preview mode: ", error);
    return NextResponse.json(
      { message: `Error enabling preview mode: ${JSON.stringify(error)}` },
      { status: 500 }
    );
  } finally {
    // redirect throws and must be outside of try catch block
    if (redirectPath) {
      console.log(
        `[LOG]: contentType: ${contentType} triggered preview mode, redirecting to: ${redirectPath}`
      );
      redirect(redirectPath);
    }
  }
}
