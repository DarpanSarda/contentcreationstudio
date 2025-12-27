'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useToast } from '@/contexts/ToastContext';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Send,
  ExternalLink,
  Upload,
  Download,
  Search,
  Filter,
  Star,
  ChevronDown,
  Zap,
  Shield,
  X,
  Loader2,
  Edit,
  Trash2,
  Eye,
  HelpCircle,
  MessageSquare,
  Book
} from 'lucide-react';
import apiClient from '@/lib/api';

export default function SupportPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('faq');
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0
  });

  const categories = [
    { value: 'technical_issue', label: 'Technical Issue', icon: <AlertCircle className="w-4 h-4" /> },
    { value: 'billing', label: 'Billing Question', icon: <FileText className="w-4 h-4" /> },
    { value: 'feature_request', label: 'Feature Request', icon: <Star className="w-4 h-4" /> },
    { value: 'general', label: 'General Question', icon: <User className="w-4 h-4" /> },
    { value: 'platform_connection', label: 'Platform Connection', icon: <User className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-accent-green' },
    { value: 'medium', label: 'Medium', color: 'text-accent-yellow' },
    { value: 'high', label: 'High', color: 'text-accent-orange' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
  ];

  const urgencies = [
    { value: 'low', label: 'Low - When convenient', time: '48-72 hours' },
    { value: 'normal', label: 'Normal - Within 24 hours', time: '12-24 hours' },
    { value: 'high', label: 'High - Within 8 hours', time: '4-8 hours' },
    { value: 'urgent', label: 'Urgent - Within 2 hours', time: '1-2 hours' }
  ];

  const faqs = [
    {
      question: 'How quickly will I get a response?',
      answer: 'Response times vary by urgency: Urgent issues (1-2 hours), High priority (4-8 hours), Normal (12-24 hours), Low (48-72 hours).'
    },
    {
      question: 'What support channels are available?',
      answer: 'You can reach us through our support portal, email (support@contentstudio.com), phone (+1-800-CONTENT), or live chat during business hours.'
    },
    {
      question: 'Do you offer phone support?',
      answer: 'Yes! Phone support is available Monday-Friday, 9 AM - 6 PM EST. Weekend support is available for urgent issues only.'
    },
    {
      question: 'Can I track my support request?',
      answer: 'Yes! Once you submit a ticket, you\'ll receive a confirmation email with a tracking number to monitor progress and view updates.'
    },
    {
      question: 'What information should I include in my ticket?',
      answer: 'Include detailed steps to reproduce the issue, your account email, and any relevant screenshots to help us resolve your issue faster.'
    }
  ];

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getSupportTickets(statusFilter, 50, 0);
      setTickets(response.tickets || []);

      // Calculate stats
      const stats = {
        total: response.total || 0,
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
      };

      (response.tickets || []).forEach(ticket => {
        if (stats[ticket.status] !== undefined) {
          stats[ticket.status]++;
        }
      });

      setTicketStats(stats);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiClient.createSupportTicket({
        subject: ticketData.subject,
        description: ticketData.description,
        category: ticketData.category,
        priority: ticketData.priority
      });

      setSubmitted(true);

      // Refresh tickets list
      fetchTickets();

      // Reset form after 3 seconds
      setTimeout(() => {
        setTicketData({
          subject: '',
          category: '',
          priority: 'medium',
          description: '',
          urgency: 'normal',
          attachments: []
        });
        setSubmitted(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setIsSubmitting(false);
    }
  };

  const viewTicketDetails = async (ticketId) => {
    try {
      const response = await apiClient.getTicketDetails(ticketId);
      if (response && response.success && response.ticket) {
        setSelectedTicket(response.ticket);
        setShowTicketModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await apiClient.updateSupportTicket(ticketId, { status: newStatus });
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return;

    try {
      await apiClient.deleteSupportTicket(ticketId);
      fetchTickets();
      setShowTicketModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-accent-orange bg-accent-orange/20 border-accent-orange/30';
      case 'in_progress': return 'text-accent-cyan bg-accent-cyan/20 border-accent-cyan/30';
      case 'resolved': return 'text-accent-green bg-accent-green/20 border-accent-green/30';
      case 'closed': return 'text-text-muted bg-card-bg/20 border-white/10';
      default: return 'text-text-muted bg-card-bg/20 border-white/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    const p = priorities.find(pr => pr.value === priority);
    return p ? p.color : 'text-text-muted';
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-text-light">Support Center</h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-text-muted hover:text-accent-cyan transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Total Tickets</p>
              <FileText className="w-5 h-5 text-accent-cyan" />
            </div>
            <p className="text-2xl font-bold text-text-light">{ticketStats.total}</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Open</p>
              <Clock className="w-5 h-5 text-accent-orange" />
            </div>
            <p className="text-2xl font-bold text-accent-orange">{ticketStats.open}</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">In Progress</p>
              <Zap className="w-5 h-5 text-accent-cyan" />
            </div>
            <p className="text-2xl font-bold text-accent-cyan">{ticketStats.in_progress}</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Resolved</p>
              <CheckCircle className="w-5 h-5 text-accent-green" />
            </div>
            <p className="text-2xl font-bold text-accent-green">{ticketStats.resolved}</p>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-text-muted">Closed</p>
              <CheckCircle className="w-5 h-5 text-text-muted" />
            </div>
            <p className="text-2xl font-bold text-text-light">{ticketStats.closed}</p>
          </div>
        </div>

        {submitted ? (
          /* Success Message */
          <div className="glass rounded-xl border border-accent-green/30 bg-accent-green/10 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-accent-green mb-2">Ticket submitted successfully!</h2>
            <p className="text-accent-green mb-6">
              Thank you for contacting our support team. We'll respond within the expected timeframe based on your issue's urgency level.
            </p>
            <p className="text-text-muted">
              Ticket ID: <span className="font-mono text-accent-cyan">SUP-{Date.now()}</span>
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105"
            >
              Submit Another Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket Form */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h2 className="text-xl font-bold text-text-light mb-6">Submit a Support Ticket</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Subject <span className="text-accent-orange">*</span>
                    </label>
                    <input
                      type="text"
                      value={ticketData.subject}
                      onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Category <span className="text-accent-orange">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setTicketData(prev => ({ ...prev, category: cat.value }))}
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all ${ticketData.category === cat.value
                            ? `border-accent-cyan bg-accent-cyan/20 text-accent-cyan`
                            : 'border-white/20 text-text-light hover:bg-card-bg/20'
                            }`}
                        >
                          {cat.icon}
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Priority
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {priorities.map((priority) => (
                        <button
                          key={priority.value}
                          type="button"
                          onClick={() => setTicketData(prev => ({ ...prev, priority: priority.value }))}
                          className={`px-4 py-2 border rounded-lg font-medium transition-all ${ticketData.priority === priority.value
                            ? `border-white/20 bg-card-bg/20 ${priority.color}`
                            : 'border-white/20 text-text-muted hover:bg-card-bg/20'
                            }`}
                        >
                          {priority.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Description <span className="text-accent-orange">*</span>
                    </label>
                    <textarea
                      value={ticketData.description}
                      onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all resize-none"
                      rows={6}
                      placeholder="Please provide as much detail as possible about your issue, including steps to reproduce it and any error messages you're seeing."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Ticket
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Tickets List */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-text-light">Your Tickets</h2>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tickets..."
                      className="pl-10 pr-4 py-2 bg-card-bg/20 border border-white/20 rounded-lg text-sm text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-cyan focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <button
                    onClick={() => setStatusFilter(null)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${statusFilter === null
                      ? 'bg-accent-cyan text-dark-bg'
                      : 'bg-card-bg/20 text-text-muted hover:bg-card-bg/40'
                      }`}
                  >
                    All
                  </button>
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${statusFilter === status
                        ? 'bg-accent-cyan text-dark-bg'
                        : 'bg-card-bg/20 text-text-muted hover:bg-card-bg/40'
                        }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Tickets */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
                    <p className="text-text-muted">No tickets found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 border border-white/10 rounded-lg hover:bg-card-bg/10 transition-colors cursor-pointer"
                        onClick={() => viewTicketDetails(ticket.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-text-light mb-1">{ticket.subject}</h3>
                            <p className="text-xs text-text-muted line-clamp-1">{ticket.description}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(ticket.status)}`}>
                              {ticket.status?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-text-muted">#{ticket.id}</span>
                            <span className={`${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className="text-text-muted">{ticket.category}</span>
                          </div>
                          <span className="text-text-muted">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Chat */}
              {/* <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">Need Immediate Help?</h3>
                <p className="text-text-muted mb-4">
                  Try our live chat support for immediate assistance with urgent issues.
                </p>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-medium transition-all hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                    Start Live Chat
                  </button>
                  <a
                    href="tel:+1-800-CONTENT"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Call Support
                  </a>
                </div>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-accent-cyan">Email</p>
                    <p className="text-sm text-text-light">support@contentstudio.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent-cyan">Phone</p>
                    <p className="text-sm text-text-light">+1-800-CONTENT</p>
                    {/* <p className="text-xs text-text-muted">Mon-Fri, 9 AM - 6 PM EST</p> */}
                  </div>
                  {/* <div>
                    <p className="text-sm font-medium text-accent-cyan">Live Chat</p>
                    <p className="text-sm text-text-light">Available during business hours</p>
                  </div> */}
                </div>

                {/* <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <p className="text-sm font-medium text-accent-green">24/7 Emergency Support</p>
                  </div>
                  <p className="text-xs text-text-muted">
                    For critical issues affecting your production environment
                  </p>
                </div> */}
              </div>

              {/* FAQ */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="text-sm font-medium text-text-light cursor-pointer list-none flex items-center justify-between hover:text-accent-cyan">
                        {faq.question}
                        <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-accent-cyan transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="mt-2 pl-4 text-sm text-text-muted">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-text-light mb-2">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-text-muted">Ticket #{selectedTicket.id}</span>
                  <span className={`px-2 py-1 rounded border text-xs ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status?.replace('_', ' ')}
                  </span>
                  <span className={`${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority} priority
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-text-muted hover:text-text-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Ticket Details */}
              <div>
                <h3 className="text-sm font-medium text-text-light mb-2">Description</h3>
                <p className="text-sm text-text-muted whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-text-light mb-2">Category</h3>
                  <p className="text-sm text-text-muted capitalize">
                    {selectedTicket.category?.replace(/_/g, ' ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-light mb-2">Created</h3>
                  <p className="text-sm text-text-muted">
                    {selectedTicket.created_at ? new Date(selectedTicket.created_at.replace(' ', 'T')).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-medium text-text-light mb-3">Update Status</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTicketStatus(selectedTicket.id, status)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedTicket.status === status
                        ? getStatusColor(status)
                        : 'bg-card-bg/20 text-text-muted hover:bg-card-bg/40 border border-white/10'
                        }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => deleteTicket(selectedTicket.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Ticket
                </button>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-cyan text-dark-bg rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
