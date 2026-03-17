export type DeploymentResult = {
  url: string;
  status: "DEPLOYED" | "FAILED";
  notes?: string;
};

export async function deployToVercel(iteration: number): Promise<DeploymentResult> {
  const hookUrl = process.env.VERCEL_GENERATED_DEPLOY_HOOK_URL ?? process.env.VERCEL_DEPLOY_HOOK_URL;
  const canonicalUrl = process.env.VERCEL_GENERATED_CANONICAL_URL ?? process.env.VERCEL_CANONICAL_URL;

  if (!hookUrl) {
    return {
      url: canonicalUrl ?? `https://autofounder-iteration-${iteration}.vercel.app`,
      status: "FAILED",
      notes: "Set VERCEL_GENERATED_DEPLOY_HOOK_URL to trigger real Vercel deployments."
    };
  }

  try {
    const response = await fetch(hookUrl, { method: "POST" });
    const body = await response.text();

    return {
      url: canonicalUrl ?? "Deployment triggered. Check Vercel dashboard for the live URL.",
      status: response.ok ? "DEPLOYED" : "FAILED",
      notes: body || "Triggered Vercel deploy hook."
    };
  } catch (error) {
    return {
      url: canonicalUrl ?? `https://autofounder-iteration-${iteration}.vercel.app`,
      status: "FAILED",
      notes: error instanceof Error ? error.message : "Unknown deploy hook error."
    };
  }
}
