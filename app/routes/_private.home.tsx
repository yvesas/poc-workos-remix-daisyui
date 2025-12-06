import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { json } from "~/utils/responses";
import type { Creative } from "~/types";

type LoaderData = {
  creatives: Creative[];
};

/**
 * Home page - displays creatives table
 * Follows Remix best practices: loader for data fetching
 */
export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response> {
  // Fetch from BFF API
  const response = await fetch(new URL("/api/creatives", request.url));
  const data = await response.json();

  return json<LoaderData>(data);
}

export default function Home() {
  const { creatives } = useLoaderData<LoaderData>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(budget / 100); // Assuming budget is in cents
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: "badge-success",
      paused: "badge-warning",
      pending: "badge-info",
      error: "badge-error",
      archived: "badge-ghost",
    };
    return badges[status] || "badge-ghost";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creatives</h1>
          <p className="text-base-content/60 mt-1">
            Transações recentes de campanhas
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary">{creatives.length}</div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body p-0">
          <div className="flex items-center justify-between p-4">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-full max-w-xs"
            />
            <button className="btn btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3 5.25A.75.75 0 013.75 4.5h16.5a.75.75 0 01.75.75v.563a.75.75 0 01-.22.53l-6.03 6.03v4.827a.75.75 0 01-.33.623l-3 2a.75.75 0 01-1.17-.623v-6.827L3.97 5.843a.75.75 0 01-.22-.53V5.25z" />
              </svg>
              Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email ID</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {creatives.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="text-base-content/60">
                        Nenhum registro
                      </div>
                    </td>
                  </tr>
                ) : (
                  creatives.map((c: Creative) => (
                    <tr key={c.id} className="hover">
                      <td className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10">
                            <img
                              src={
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                              }
                              alt="avatar"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">
                            {c.meta_creative?.ad_title || "—"}
                          </div>
                          <div className="text-sm opacity-50">
                            {c.meta_creative?.campaign_name || "—"}
                          </div>
                        </div>
                      </td>
                      <td>{c.meta_creative?.ad_website_url || "—"}</td>
                      <td>{c.platform}</td>
                      <td>
                        {formatBudget(
                          c.meta_creative?.adset_daily_budget || null
                        )}
                      </td>
                      <td className="text-sm">{formatDate(c.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
