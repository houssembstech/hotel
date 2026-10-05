import React from 'react';

export default function AdminLogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10 pt-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Audit & System Logs</h1>
          <p className="text-slate-400">Track critical actions, server health, and third-party integrations.</p>
        </div>
      </div>

      {/* System Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-emerald-500/30 border rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Render API Latency</p>
            <h2 className="text-3xl font-serif text-white">42ms</h2>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-xl">⚡</div>
        </div>
        <div className="glass-card p-6 border-emerald-500/30 border rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">MongoDB Atlas</p>
            <h2 className="text-3xl font-serif text-white">Online</h2>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-xl">💾</div>
        </div>
        <div className="glass-card p-6 border-sky-500/30 border rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Cloudinary Storage</p>
            <h2 className="text-3xl font-serif text-white">2.4 GB</h2>
          </div>
          <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-full flex items-center justify-center text-xl">☁️</div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="text-white font-medium">Global Activity Feed</h3>
          <button className="text-slate-400 hover:text-white transition-colors text-sm">Download CSV</button>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-xs uppercase tracking-wider">
              <th className="font-medium pb-4 pt-4 pl-6">Timestamp</th>
              <th className="font-medium pb-4 pt-4">User</th>
              <th className="font-medium pb-4 pt-4">Action</th>
              <th className="font-medium pb-4 pt-4">Target / IP</th>
              <th className="font-medium pb-4 pt-4 text-right pr-6">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-300 text-sm">
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="py-4 pl-6 text-slate-400">Just now</td>
              <td className="py-4 font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs">R</span>
                Reception (reception@)
              </td>
              <td className="py-4">Checked-in Guest (Walk-in)</td>
              <td className="py-4 font-mono text-slate-500">Room 304</td>
              <td className="py-4 text-right pr-6"><span className="text-emerald-400">Success</span></td>
            </tr>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="py-4 pl-6 text-slate-400">10 mins ago</td>
              <td className="py-4 font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs">D</span>
                Manager (director@)
              </td>
              <td className="py-4">Modified Rate: Executive Suite</td>
              <td className="py-4 font-mono text-slate-500">Rate Plan Update</td>
              <td className="py-4 text-right pr-6"><span className="text-emerald-400">Success</span></td>
            </tr>
            <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
              <td className="py-4 pl-6 text-slate-400">1 hour ago</td>
              <td className="py-4 font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500/20 text-red-500 flex items-center justify-center text-xs">SA</span>
                Admin (admin@)
              </td>
              <td className="py-4">Generated YTD Financial Report</td>
              <td className="py-4 font-mono text-slate-500">192.168.1.1 (Export)</td>
              <td className="py-4 text-right pr-6"><span className="text-emerald-400">Success</span></td>
            </tr>
            <tr className="hover:bg-slate-800/30 transition-colors">
              <td className="py-4 pl-6 text-slate-400">3 hours ago</td>
              <td className="py-4 font-medium text-slate-500">SYSTEM</td>
              <td className="py-4">Cloudinary API Sync</td>
              <td className="py-4 font-mono text-slate-500">Cron Job</td>
              <td className="py-4 text-right pr-6"><span className="text-emerald-400">Success</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
