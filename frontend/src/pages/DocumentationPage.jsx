import React from 'react';
import { BookOpen, ShieldCheck, ListChecks, FileText } from 'lucide-react';

const GUIDES = [
  {
    title: 'Proxy Workflow',
    description: 'Capture live requests, inspect headers, and review responses before testing.',
  },
  {
    title: 'Repeater Workflow',
    description: 'Modify saved requests and resend them quickly to validate behavior changes.',
  },
  {
    title: 'Scanner Workflow',
    description: 'Launch scans, track progress, and review findings by severity.',
  },
  {
    title: 'Intruder Workflow',
    description: 'Configure payloads and evaluate response patterns for weak input handling.',
  },
  {
    title: 'Target Mapping Workflow',
    description: 'Crawl targets and review discovered endpoints before deeper testing.',
  },
  {
    title: 'Admin Controls',
    description: 'Review users and platform activity from the administration dashboard.',
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="text-red-400" size={30} />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">WebSecSuite Documentation</h1>
          </div>
          <p className="text-slate-300">
            Use this page as your in-app guide for core workflows. Always test only systems you are
            explicitly authorized to assess.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map((guide) => (
            <article key={guide.title} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
              <h2 className="text-lg font-bold text-slate-100 mb-2">{guide.title}</h2>
              <p className="text-sm text-slate-400">{guide.description}</p>
            </article>
          ))}
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ListChecks className="text-red-400" size={20} />
            Recommended Testing Flow
          </h2>
          <ol className="space-y-3 text-slate-300 list-decimal list-inside">
            <li>Map the target to discover endpoints.</li>
            <li>Capture traffic through the proxy while using the application normally.</li>
            <li>Replay and mutate key requests in repeater.</li>
            <li>Run scanner and intruder checks against high-value endpoints.</li>
            <li>Review findings and document remediation recommendations.</li>
          </ol>
        </section>

        <section className="bg-yellow-900/60 border border-yellow-700 rounded-lg p-6">
          <h2 className="text-lg font-bold text-yellow-200 mb-2 flex items-center gap-2">
            <ShieldCheck size={20} />
            Legal and Safety Notice
          </h2>
          <p className="text-yellow-100 text-sm">
            Perform security testing only with written authorization. Unauthorized testing may violate
            law and policy.
          </p>
        </section>

        <section className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="text-red-400" size={20} />
            Need More Detail?
          </h2>
          <p className="text-slate-300 text-sm">
            For deployment, architecture, and production guidance, refer to the project documentation
            files in the repository root.
          </p>
        </section>
      </div>
    </div>
  );
}
