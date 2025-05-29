import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSupabaseCache } from '../../hooks/useSupabaseCache';
import {
  BarChart,
  Share2,
  MessageSquare,
  Heart,
  TrendingUp
} from 'lucide-react';

const Analytics = () => {
  const { t, i18n } = useTranslation();
  const { data: analytics, loading } = useSupabaseCache('post_analytics', `
    post_id,
    posts!inner(
      title_${i18n.language} as title,
      slug_${i18n.language} as slug
    ),
    view_count,
    share_count,
    reaction_count,
    comment_count
  `, {
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Views</h3>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold">
            {analytics?.reduce((sum, a) => sum + (a.view_count || 0), 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Shares</h3>
            <Share2 className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold">
            {analytics?.reduce((sum, a) => sum + (a.share_count || 0), 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Reactions</h3>
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold">
            {analytics?.reduce((sum, a) => sum + (a.reaction_count || 0), 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Comments</h3>
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold">
            {analytics?.reduce((sum, a) => sum + (a.comment_count || 0), 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Top Posts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reactions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comments
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics
                ?.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .map((post) => (
                  <tr key={post.post_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {post.posts.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {post.view_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {post.share_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {post.reaction_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {post.comment_count || 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;