import { json } from "~/utils/responses";
import { list as listCreatives } from "~/services/creativeService.server";

/**
 * API route to fetch creatives data (BFF pattern)
 * Mock data based on backend Creative model
 * In production, this would call the real backend API
 */
export async function loader() {
  const creatives = await listCreatives();
  return json({ creatives });
}
