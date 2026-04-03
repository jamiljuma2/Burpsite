import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import useAuthStore from '../context/authStore';
import { BarChart3, Shield } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalScans: 0,
    totalRequests: 0,
    totalTargets: 0,
    recentVulnerabilities: 0,
  });
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [scans, requests, targets] = await Promise.all([
        apiClient.get('/scans'),
        apiClient.get('/requests'),
        apiClient.get('/targets'),
      ]);

      const totalVulnerabilities = scans.data.reduce(
        (sum, scan) => sum + (scan.vulnerabilities?.length || 0),
        0
      );

      setStats({
        totalScans: scans.data.length,
        totalRequests: requests.data.length,
        totalTargets: targets.data.length,
        recentVulnerabilities: totalVulnerabilities,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Scans',
      value: stats.totalScans,
      color: 'bg-blue-600',
      onClick: () => navigate('/scanner'),
    },
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      color: 'bg-purple-600',
      onClick: () => navigate('/proxy'),
    },
    {
      title: 'Total Targets',
      value: stats.totalTargets,
      color: 'bg-green-600',
      onClick: () => navigate('/targets'),
    },
    {
      title: 'Vulnerabilities Found',
      value: stats.recentVulnerabilities,
      color: 'bg-red-600',
      onClick: () => navigate('/scanner'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Shield className="text-red-400" size={40} />
            Welcome to Burpsite
          </h1>
          <p className="text-slate-400">
            {user?.username}, get started with web security testing
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={card.onClick}
              className={`${card.color} rounded-lg p-6 text-white cursor-pointer hover:opacity-90 transition transform hover:scale-105`}
            >
              <h3 className="text-slate-100 mb-2">{card.title}</h3>
              <div className="text-4xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickLinkCard
              title="Start a Security Scan"
              description="Scan URLs for common vulnerabilities"
              onClick={() => navigate('/scanner')}
            />
            <QuickLinkCard
              title="Use Proxy Interceptor"
              description="Intercept and analyze HTTP requests"
              onClick={() => navigate('/proxy')}
            />
            <QuickLinkCard
              title="Repeat Requests"
              description="Modify and resend HTTP requests"
              onClick={() => navigate('/repeater')}
            />
            <QuickLinkCard
              title="Map Target"
              description="Crawl and discover endpoints"
              onClick={() => navigate('/targets')}
            />
            <QuickLinkCard
              title="Run Intruder Attack"
              description="Perform fuzzing and brute-force attacks"
              onClick={() => navigate('/intruder')}
            />
            <QuickLinkCard
              title="Documentation"
              description="Learn about security testing"
              disabled
            />
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="text-red-400" />
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureItem title="Proxy Interceptor" description="Intercept HTTP/HTTPS requests in real-time" />
            <FeatureItem title="Request Repeater" description="Resend and modify HTTP requests" />
            <FeatureItem title="Security Scanner" description="Detect SQL injection, XSS, CSRF, and more" />
            <FeatureItem title="Intruder Tool" description="Perform attacks with custom payloads" />
            <FeatureItem title="Target Mapping" description="Crawl and discover application endpoints" />
            <FeatureItem
              title="Advanced Reporting"
              description="Export detailed vulnerability reports"
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-900 border border-yellow-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-200 mb-2">⚠️ Legal Disclaimer</h3>
          <p className="text-yellow-100 text-sm">
            This tool is designed for authorized security testing only. Unauthorized access to
            computer systems is illegal. Always obtain written permission before testing any
            systems you do not own or have explicit authorization to test.
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({ title, description, onClick, disabled = false }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`bg-slate-700 rounded-lg p-4 transition ${
        !disabled ? 'cursor-pointer hover:bg-slate-600' : 'opacity-50'
      }`}
    >
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}

function FeatureItem({ title, description }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mt-1">
        <span className="text-white font-bold">✓</span>
      </div>
      <div>
        <h3 className="font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}
