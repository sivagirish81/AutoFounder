export type PublishResult = {
  ok: boolean;
  message: string;
};

const GITHUB_API = "https://api.github.com";

export async function publishGeneratedSite(payload: {
  code: string;
  idea: string;
  iteration: number;
}): Promise<PublishResult> {
  const token = process.env.GITHUB_DISPATCH_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!token || !owner || !repo) {
    return {
      ok: false,
      message: "Missing GITHUB_DISPATCH_TOKEN, GITHUB_OWNER, or GITHUB_REPO."
    };
  }

  const body = {
    event_type: "publish-generated-site",
    client_payload: {
      path: "generated-app/app/page.tsx",
      content_base64: Buffer.from(payload.code, "utf-8").toString("base64"),
      idea: payload.idea,
      iteration: payload.iteration,
      timestamp: new Date().toISOString()
    }
  };

  const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "autofounder"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    return { ok: false, message: `GitHub dispatch failed: ${response.status} ${text}` };
  }

  return { ok: true, message: "Dispatched GitHub workflow." };
}
