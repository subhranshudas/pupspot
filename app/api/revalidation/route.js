import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request) {
  const requestHeaders = new Headers(request.headers);
  const secret = requestHeaders.get("x-vercel-reval-key");

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const contentType = body.sys.contentType.sys.id;
    console.log(
      "[LOG]: Revalidate.request.body.sys.contentType.sys.id",
      contentType
    );

    const slug = body.fields?.slug?.["en-US"];
    console.log("[LOG]: Revalidate.request.body.fields?.slug?.[en-US]", slug);

    switch (contentType) {
      case "posts": {
        console.log("[LOG]: Revalidate revalidateTag('posts')");
        revalidateTag("posts");
        break;
      }

      case "products": {
        console.log("[LOG]: Revalidate revalidateTag('products')");
        revalidateTag("products");
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

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
