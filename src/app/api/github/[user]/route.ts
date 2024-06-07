import cacheGithub from "@/lib/github-controller";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { user: string } }
) {
  const { user } = params;

  if (isNaN(parseInt(user))) {
    return NextResponse.json(
      {
        error: "User not found.",
      },
      { status: 404 }
    );
  }

  if (cacheGithub.has(user)) {
    const cache = cacheGithub.get(user);
    if (Date.now() - cache.expires < 3600000) {
      return NextResponse.json(cacheGithub.get(user).data);
    } else {
      cacheGithub.remove(user);
    }
  }

  const baseUrl = "https://api.github.com/user/";
  const resp = await fetch(`${baseUrl}${user}`, {
    method: "GET",
  });
  if (!resp.ok) {
    return NextResponse.json(
      {
        error: "User not found.",
      },
      { status: 404 }
    );
  }
  const data = await resp.json();

  cacheGithub.set(user, data);

  return NextResponse.json(data);
}
