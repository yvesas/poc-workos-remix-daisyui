import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { json } from '~/utils/responses';
import type { Creative } from '~/types';

type LoaderData = {
  creatives: Creative[];
};

/**
 * Home page - displays creatives table
 * Follows Remix best practices: loader for data fetching
 */
export async function loader({ request }: LoaderFunctionArgs): Promise<Response> {
  // Fetch from BFF API
  const response = await fetch(new URL('/api/creatives', request.url));
  const data = await response.json();

  return json<LoaderData>(data);
}

export default function Home() {
  const { creatives } = useLoaderData<LoaderData>();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(budget / 100); // Assuming budget is in cents
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'badge-success',
      paused: 'badge-warning',
      pending: 'badge-info',
      error: 'badge-error',
      archived: 'badge-ghost',
    };
    return badges[status] || 'badge-ghost';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">creatives</h1>
          <p className="text-base-content/60 mt-1">
            Gerencie seus creatives de campanhas publicitárias
          </p>
        </div>
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary">{creatives.length}</div>
          </div>
        </div>
      </div>

      {/* creatives Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Craft ID</th>
                  <th>Campanha</th>
                  <th>Título do Anúncio</th>
                  <th>Plataforma</th>
                  <th>Status</th>
                  <th>Budget Diário</th>
                  <th>Criado em</th>
                </tr>
              </thead>
              <tbody>
                {creatives.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 opacity-30"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                        <p className="text-base-content/60">Nenhum creativo encontrado</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  creatives.map((creativo: Creative) => (
                    <tr key={creativo.id} className="hover">
                      <td className="font-mono text-sm">{creativo.craft_id}</td>
                      <td>{creativo.meta_creative?.campaign_name || '-'}</td>
                      <td>{creativo.meta_creative?.ad_title || '-'}</td>
                      <td>
                        <span className="badge badge-outline capitalize">
                          {creativo.platform}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(creativo.status)} capitalize`}>
                          {creativo.status}
                        </span>
                      </td>
                      <td>{formatBudget(creativo.meta_creative?.adset_daily_budget || null)}</td>
                      <td className="text-sm">{formatDate(creativo.created_at)}</td>
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
