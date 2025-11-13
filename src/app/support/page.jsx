// app/support/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  X
} from 'lucide-react';

export default function SupportPage() {
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    urgency: 'normal',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: 'technical', label: 'Technical Issue', icon: <AlertCircle className="w-4 h-4" /> },
    { value: 'billing', label: 'Billing Question', icon: <FileText className="w-4 h-4" /> },
    { value: 'feature', label: 'Feature Request', icon: <Star className="w-4 h-4" /> },
    { value: 'account', label: 'Account Issue', icon: <User className="w-4 h-4" /> },
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

  const recentTickets = [
    {
      id: '1',
      subject: 'AI Research Agent Not Responding',
      category: 'technical',
      status: 'open',
      priority: 'high',
      urgency: 'high',
      created: '2 hours ago',
      updated: '30 minutes ago',
      user: 'Sarah Johnson'
    },
    {
      id: '2',
      subject: 'Question About Billing',
      category: 'billing',
      status: 'closed',
      priority: 'low',
      urgency: 'normal',
      created: '1 day ago',
      updated: '12 hours ago',
      user: 'John Doe'
    },
    {
      id: '3',
      subject: 'WordPress Integration Help',
      category: 'technical',
      status: 'in-progress',
      priority: 'medium',
      urgency: 'normal',
      created: '2 days ago',
      updated: '3 hours ago',
      user: 'Mike Wilson'
    }
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
      answer: 'Yes! Once you submit a ticket, youll receive a confirmation email with a tracking number to monitor progress and view updates.'
    },
    {
      question: 'What information should I include in my ticket?',
      answer: 'Include detailed steps to reproduce the issue, your account email, and any relevant screenshots to help us resolve your issue faster.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitted(true);

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
      }, 3000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-accent-orange';
      case 'in-progress': return 'text-accent-cyan';
      case 'closed': return 'text-accent-green';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

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
                href="/help"
                className="text-text-muted hover:text-accent-cyan transition-colors"
              >
                ← Back to Help
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitted ? (
          /* Success Message */
          <div className="glass rounded-xl border border-accent-green/30 bg-accent-green/10 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-accent-green mb-2">Ticket Submitted Successfully!</h2>
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
            {/* Ticket Form */}
            <div className="lg:col-span-2">
              <div className="glass rounded-xl border border-white/10 p-6 mb-8">
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
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all ${
                            ticketData.category === cat.value
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

                  {/* Priority and Urgency */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Priority
                      </label>
                      <div className="space-y-2">
                        {priorities.map((priority) => (
                          <button
                            key={priority.value}
                            type="button"
                            onClick={() => setTicketData(prev => ({ ...prev, priority: priority.value }))}
                            className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg font-medium transition-all ${
                              ticketData.priority === priority.value
                                ? `border-white/20 bg-card-bg/20 text-text-light`
                                : 'border-white/20 text-text-muted hover:bg-card-bg/20'
                            }`}
                          >
                            <span>{priority.label}</span>
                            <span className={`w-2 h-2 rounded-full ${priority.color}`}></span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">
                        Urgency
                      </label>
                      <div className="space-y-2">
                        {urgencies.map((urgency) => (
                          <button
                            key={urgency.value}
                            type="button"
                            onClick={() => setTicketData(prev => ({ ...prev, urgency: urgency.value }))}
                            className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg text-sm transition-all ${
                              ticketData.urgency === urgency.value
                                ? `border-accent-orange bg-accent-orange/20 text-accent-orange`
                                : 'border-white/20 text-text-muted hover:bg-card-bg/20'
                            }`}
                          >
                            <span>{urgency.label}</span>
                            <span className="text-xs text-text-muted">{urgency.time}</span>
                          </button>
                        ))}
                      </div>
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
                      rows={8}
                      placeholder="Please provide as much detail as possible about your issue, including steps to reproduce it and any error messages you're seeing."
                      required
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Attachments (Optional)
                    </label>
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-accent-cyan/50 transition-colors">
                      <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
                      <p className="text-sm text-text-light mb-2">
                        Drag and drop files here or click to upload
                      </p>
                      <p className="text-xs text-text-muted">
                        Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setTicketData(prev => ({
                            ...prev,
                            attachments: [...prev.attachments, ...files]
                          }));
                        }}
                      />
                    </div>
                    {ticketData.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {ticketData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-card-bg/20 rounded border border-white/10">
                            <div className="flex items-center gap-2 text-sm text-text-light">
                              <FileText className="w-4 h-4" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <button
                              onClick={() => {
                                setTicketData(prev => ({
                                  ...prev,
                                  attachments: prev.attachments.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

              {/* Live Chat */}
              <div className="glass rounded-xl border border-white/10 p-6">
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
              </div>
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
                    <p className="text-xs text-text-muted">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent-cyan">Live Chat</p>
                    <p className="text-sm text-text-light">Available during business hours</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-accent-green" />
                    <p className="text-sm font-medium text-accent-green">24/7 Emergency Support</p>
                  </div>
                  <p className="text-xs text-text-muted">
                    For critical issues affecting your production environment
                  </p>
                </div>
              </div>

              {/* Recent Tickets */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">Recent Tickets</h3>
                <div className="space-y-3">
                  {recentTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/support/ticket/${ticket.id}`}
                      className="block p-3 border border-white/10 rounded-lg hover:bg-card-bg/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-text-light truncate">{ticket.subject}</p>
                          <p className="text-xs text-text-muted">#{ticket.id} • {ticket.user}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`text-xs ${priorities.find(p => p.value === ticket.priority)?.color}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>{ticket.created}</span>
                        <span>{ticket.updated}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="glass rounded-xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-text-light mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="text-sm font-medium text-text-light cursor-pointer list-none flex items-center justify-between hover:text-accent-cyan">
                        {faq.question}
                        <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-accent-cyan transition-transform" />
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
    </div>
  );
}