import cacheGithub from "@/lib/github-controller";

async function fetchUser(id: string) {
  "use server";

  if (isNaN(parseInt(id))) {
    return {
      error: "User not found.",
      status: 404,
    };
  }

  if (cacheGithub.has(id)) {
    const cache = cacheGithub.get(id);
    if (Date.now() - cache.expires < 3600000 * 1) {
      return cacheGithub.get(id).data;
    } else {
      cacheGithub.remove(id);
    }
  }

  const baseUrl = "https://api.github.com/user";
  const resp = await fetch(`${baseUrl}/${id}`, {
    method: "GET",
  });
  if (!resp.ok) {
    return {
      error: "User not found.",
      status: 404,
    };
  }
  const data = await resp.json();
  cacheGithub.set(id, data);

  return data;
}

export const GithubService = {
  fetchUser,
};
