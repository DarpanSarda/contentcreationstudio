// app/agents/page.jsx
'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  Bot,
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  FileText,
  Hash,
  Image,
  Mail,
  Target,
  Settings,
  Trash2,
  ChevronDown,
  Info,
  BarChart3,
  Timer,
  Zap as ZapIcon,
  Brain
} from 'lucide-react';

export default function AgentMonitoringPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with empty states - data will be fetched from API
  const [agentStatus, setAgentStatus] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [taskLogs, setTaskLogs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);
  const [taskStatistics, setTaskStatistics] = useState({
    tasksPerHour: 0,
    avgDuration: 0,
    costPerTask: 0,
    aiAccuracy: 0
  });

  const [logFilters, setLogFilters] = useState({
    agent: 'all',
    level: 'all',
    timeRange: '1h'
  });

  const [showTaskDetails, setShowTaskDetails] = useState(false);

  // Fetch agent status from API
  useEffect(() => {
    fetchAgentStatus();
  }, []);

  const fetchAgentStatus = async () => {
    try {
      // Fetch all data in parallel
      const [agentStatusRes, workflowsRes, logsRes, metricsRes] = await Promise.all([
        apiClient.getAgentStatus().catch(err => {
          console.error('Agent status error:', err);
          return null;
        }),
        apiClient.getActiveWorkflows().catch(err => {
          console.error('Workflows error:', err);
          return { workflows: [] };
        }),
        apiClient.getTaskLogs(logFilters).catch(err => {
          console.error('Logs error:', err);
          return { logs: [] };
        }),
        apiClient.getPerformanceMetrics().catch(err => {
          console.error('Metrics error:', err);
          return { metrics: [], statistics: {} };
        })
      ]);

      // Update agent status
      if (agentStatusRes && agentStatusRes.agents) {
        setAgentStatus(agentStatusRes.agents);
      } else if (agentStatusRes) {
        // Fallback: Map old format to new format
        const mappedAgents = [
          {
            id: 'research',
            name: 'Research Agent',
            status: agentStatusRes.research?.active > 0 ? 'running' : 'idle',
            currentTask: agentStatusRes.research?.active > 0 ? 'Researching...' : null,
            queueLength: agentStatusRes.research?.active || 0,
            lastActivity: new Date().toISOString(),
            performance: {
              successRate: 98.5,
              errorRate: 1.5,
              avgCompletionTime: 12.3
            }
          },
          {
            id: 'writing',
            name: 'Writing Agent',
            status: agentStatusRes.write?.active > 0 ? 'running' : 'idle',
            currentTask: agentStatusRes.write?.active > 0 ? 'Writing content...' : null,
            queueLength: agentStatusRes.write?.active || 0,
            lastActivity: new Date().toISOString(),
            performance: {
              successRate: 96.2,
              errorRate: 3.8,
              avgCompletionTime: 8.7
            }
          },
          {
            id: 'image',
            name: 'Image Generation Agent',
            status: agentStatusRes.images?.active > 0 ? 'running' : 'idle',
            currentTask: agentStatusRes.images?.active > 0 ? 'Generating images...' : null,
            queueLength: agentStatusRes.images?.active || 0,
            lastActivity: new Date().toISOString(),
            performance: {
              successRate: 92.1,
              errorRate: 7.9,
              avgCompletionTime: 15.2
            }
          },
          {
            id: 'publishing',
            name: 'Publishing Agent',
            status: 'idle',
            currentTask: null,
            queueLength: 0,
            lastActivity: new Date().toISOString(),
            performance: {
              successRate: 99.8,
              errorRate: 0.2,
              avgCompletionTime: 5.4
            }
          }
        ];
        setAgentStatus(mappedAgents);
      }

      // Update workflows
      if (workflowsRes?.workflows) {
        setActiveWorkflows(workflowsRes.workflows);
      }

      // Update logs
      if (logsRes?.logs) {
        setTaskLogs(logsRes.logs);
      }

      // Update metrics
      if (metricsRes?.metrics) {
        setPerformanceMetrics(metricsRes.metrics);
      }
      if (metricsRes?.statistics) {
        setTaskStatistics({
          tasksPerHour: metricsRes.statistics.tasks_per_hour || 0,
          avgDuration: metricsRes.statistics.avg_duration || 0,
          costPerTask: metricsRes.statistics.cost_per_task || 0,
          aiAccuracy: metricsRes.statistics.ai_accuracy || 0
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <Activity className="w-5 h-5 text-accent-green" />;
      case 'idle': return <Pause className="w-5 h-5 text-accent-yellow" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-text-muted" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-accent-green border-accent-green/30';
      case 'idle': return 'text-accent-yellow border-accent-yellow/30';
      case 'error': return 'text-red-500 border-red-500/30';
      default: return 'text-text-muted border-white/30';
    }
  };

  const getStepStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-accent-green" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-accent-cyan animate-spin" />;
      case 'pending': return <Clock className="w-4 h-4 text-text-muted" />;
      default: return <Clock className="w-4 h-4 text-text-muted" />;
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-accent-yellow';
      case 'info': return 'text-accent-cyan';
      default: return 'text-text-muted';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleWorkflowAction = async (workflowId, action) => {
    try {
      switch (action) {
        case 'pause':
          await apiClient.pauseWorkflow(workflowId);
          setActiveWorkflows(prev => prev.map(wf =>
            wf.id === workflowId ? { ...wf, status: 'paused' } : wf
          ));
          break;
        case 'resume':
          await apiClient.resumeWorkflow(workflowId);
          setActiveWorkflows(prev => prev.map(wf =>
            wf.id === workflowId ? { ...wf, status: 'running' } : wf
          ));
          break;
        case 'cancel':
          await apiClient.cancelWorkflow(workflowId);
          setActiveWorkflows(prev => prev.filter(wf => wf.id !== workflowId));
          break;
      }
      // Refresh data after action
      fetchAgentStatus();
    } catch (error) {
      console.error(`Failed to ${action} workflow:`, error);
      if (toast?.error) {
        toast.error(`Failed to ${action} workflow`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading agent status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Agent Monitoring</h1>
              <span className="text-sm text-text-muted">
                Real-time AI agent activity and performance
              </span>
            </div>
            <button
              onClick={fetchAgentStatus}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {agentStatus.map((agent) => (
            <div key={agent.id} className="glass rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getStatusColor(agent.status)} bg-opacity-20 border rounded-lg flex items-center justify-center`}>
                    {getStatusIcon(agent.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-light">{agent.name}</h3>
                    <p className="text-sm text-text-muted capitalize">{agent.status}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} bg-opacity-50`} />
              </div>

              <div className="space-y-3">
                {agent.currentTask && (
                  <div>
                    <p className="text-sm text-text-muted mb-1">Current Task:</p>
                    <p className="text-sm text-text-light line-clamp-2">{agent.currentTask}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Queue:</span>
                  <span className="text-text-light font-medium">{agent.queueLength} items</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Success Rate:</span>
                  <span className="text-accent-green font-medium">{agent.performance.successRate}%</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Avg Time:</span>
                  <span className="text-text-light font-medium">{agent.performance.avgCompletionTime}s</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Workflows */}
        <div className="glass rounded-xl border border-white/10 p-6 mb-8">
          <h2 className="text-xl font-bold text-text-light mb-6">Active Workflows</h2>

          {activeWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-light mb-2">No Active Workflows</h3>
              <p className="text-text-muted mb-6">All AI agents are currently idle</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeWorkflows.map((workflow) => (
                <div key={workflow.id} className="border border-white/10 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-semibold text-text-light text-lg">{workflow.title}</h3>
                      <p className="text-sm text-text-muted">
                        Started {formatTime(workflow.createdAt)} • Est. {workflow.estimatedTime} remaining
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-accent-cyan font-medium">
                        {workflow.progress}% complete
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWorkflowAction(workflow.id, workflow.status === 'paused' ? 'resume' : 'pause')}
                          className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
                        >
                          {workflow.status === 'paused' ? (
                            <Play className="w-4 h-4 text-text-light" />
                          ) : (
                            <Pause className="w-4 h-4 text-text-light" />
                          )}
                        </button>
                        <button
                          onClick={() => handleWorkflowAction(workflow.id, 'cancel')}
                          className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
                        >
                          <XCircle className="w-4 h-4 text-text-light" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Workflow Steps Timeline */}
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-text-muted mb-2">
                        <span>Workflow Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <div className="w-full bg-card-bg/50 rounded-full h-2">
                        <div
                          className="h-2 bg-accent-cyan rounded-full transition-all"
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4">
                      {workflow.steps.map((step, index) => (
                        <div key={step.name} className="flex items-start gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-card-bg/20 border border-white/20">
                            {getStepStatusIcon(step.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-text-light capitalize">{step.name}</p>
                                <p className="text-sm text-text-muted">{step.duration}</p>
                              </div>
                              <div className="text-right">
                                {step.result && (
                                  <p className="text-xs text-accent-cyan">{step.result}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Performance Metrics</h2>

            {performanceMetrics.length > 0 ? (
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card-bg/10 rounded-lg">
                    <div>
                      <p className="text-sm text-text-muted capitalize">
                        {(metric.agentId || 'unknown').replace('agent', '')} Agent
                      </p>
                      <p className="text-sm text-text-light capitalize">
                        {(metric.metric || '').replace(/([A-Z])/g, ' $1').trim() || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-text-light">
                        {metric.metric === 'avgCompletionTime' ? `${metric.value || 0}s` : `${metric.value || 0}%`}
                      </span>
                      {metric.change !== undefined && (
                        <div className="flex items-center gap-1">
                          {metric.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-accent-green" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-accent-green' : 'text-red-500'}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No performance metrics available yet</p>
                <p className="text-sm text-text-muted mt-2">Metrics will appear as agents complete tasks</p>
              </div>
            )}
          </div>

          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-text-light mb-6">Task Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card-bg/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-accent-orange" />
                  <span className="text-sm text-text-muted">Tasks/Hour</span>
                </div>
                <p className="text-2xl font-bold text-text-light">{taskStatistics.tasksPerHour || 0}</p>
                <p className="text-xs text-accent-green">Real-time data</p>
              </div>

              <div className="p-4 bg-card-bg/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Timer className="w-6 h-6 text-accent-cyan" />
                  <span className="text-sm text-text-muted">Avg Duration</span>
                </div>
                <p className="text-2xl font-bold text-text-light">{taskStatistics.avgDuration || 0}s</p>
                <p className="text-xs text-accent-green">Real-time data</p>
              </div>

              <div className="p-4 bg-card-bg/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <ZapIcon className="w-6 h-6 text-accent-yellow" />
                  <span className="text-sm text-text-muted">Cost/Task</span>
                </div>
                <p className="text-2xl font-bold text-text-light">${taskStatistics.costPerTask?.toFixed(2) || '0.00'}</p>
                <p className="text-xs text-accent-green">Real-time data</p>
              </div>

              <div className="p-4 bg-card-bg/10 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  <span className="text-sm text-text-muted">AI Accuracy</span>
                </div>
                <p className="text-2xl font-bold text-text-light">{taskStatistics.aiAccuracy || 0}%</p>
                <p className="text-xs text-accent-green">Real-time data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Logs */}
        <div className="glass rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-light">Task Logs</h2>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-10 pr-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted text-sm w-48"
                />
              </div>

              {/* Filters */}
              <select
                value={logFilters.agent}
                onChange={(e) => setLogFilters(prev => ({ ...prev, agent: e.target.value }))}
                className="px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light text-sm"
              >
                <option value="all">All Agents</option>
                {agentStatus.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>

              <select
                value={logFilters.level}
                onChange={(e) => setLogFilters(prev => ({ ...prev, level: e.target.value }))}
                className="px-3 py-2 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light text-sm"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>

              <button
                onClick={() => setShowTaskDetails(!showTaskDetails)}
                className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Info className="w-4 h-4 text-text-light" />
              </button>
            </div>
          </div>

          {/* Log Stream */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {taskLogs.length > 0 ? (
              taskLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-3 bg-card-bg/10 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getLogLevelColor(log.level)} bg-opacity-50`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-text-light">{log.agent || 'Unknown Agent'}</span>
                        <span className="text-xs text-accent-cyan">•</span>
                        <span className="text-xs text-text-muted">{log.workflow || 'Unknown Workflow'}</span>
                      </div>
                      <span className="text-xs text-text-muted">
                        {log.timestamp ? formatTime(new Date(log.timestamp)) : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-text-light mb-1">{log.message || 'No message'}</p>
                    {showTaskDetails && log.details && (
                      <div className="text-xs text-text-muted bg-card-bg/20 rounded p-2">
                        <pre>{JSON.stringify(log.details, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-text-muted">No logs available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}