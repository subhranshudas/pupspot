import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import CONTENT_TYPE from "@/lib/content-types";

export async function POST(request) {
  const requestHeaders = new Headers(request.headers);
  const secret = requestHeaders.get("x-vercel-reval-key");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let revalidatedTarget = {};

  try {
    const body = await request.json();

    const contentType = body.sys.contentType.sys.id;
    console.log(
      "[LOG]: Revalidate.request.body.sys.contentType.sys.id",
      contentType
    );

    if (!contentType) {
      return NextResponse.json(
        { message: "Invalid contentType" },
        { status: 400 }
      );
    }

    const slug = body.fields?.slug?.["en-US"];
    console.log("[LOG]: Revalidate.request.body.fields?.slug?.[en-US]", slug);

    if (!slug) {
      return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
    }

    let path = null;

    switch (contentType) {
      case CONTENT_TYPE.DOG: {
        console.log(`[LOG]: Revalidate revalidateTag(${CONTENT_TYPE.DOG})`);
        revalidateTag(CONTENT_TYPE.DOG);
        path = `/dogs/${slug}`;
        revalidatePath(path);
        revalidatedTarget.tag = CONTENT_TYPE.DOG;
        revalidatedTarget.path = path;
        break;
      }

      case CONTENT_TYPE.PRODUCT: {
        console.log(`[LOG]: Revalidate revalidateTag(${CONTENT_TYPE.PRODUCT})`);
        revalidateTag(CONTENT_TYPE.PRODUCT);
        revalidatedTarget.tag = CONTENT_TYPE.PRODUCT;
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Error revalidating: ", error);
    return NextResponse.json(
      { message: `Error revalidating: ${JSON.stringify(error)}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    revalidatedTarget: revalidatedTarget,
  });
}
