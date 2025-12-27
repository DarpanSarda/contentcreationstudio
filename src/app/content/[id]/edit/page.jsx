'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  FileText,
  Eye,
  Code,
  BookOpen,
  Maximize2,
  Minimize2,
  Calendar,
  Type,
  Hash
} from 'lucide-react';

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const contentId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    status: 'draft',
    content_type: 'article'
  });

  const [parsedContent, setParsedContent] = useState(null);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'raw' | 'edit'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    setIsFetching(true);
    try {
      const response = await apiClient.getContentById(contentId);
      setFormData({
        title: response.title || '',
        body: response.body || '',
        status: response.status || 'draft',
        content_type: response.content_type || 'article'
      });

      // Try to parse the body as JSON
      if (response.body) {
        try {
          const parsed = JSON.parse(response.body);
          setParsedContent(parsed);
        } catch (e) {
          // If not JSON, treat as plain text
          setParsedContent(null);
        }
      }
    } catch (error) {
      console.error('Fetch content error:', error);
      toast.error('Failed to load content');
    } finally {
      setIsFetching(false);
    }
  };

  // Enhanced helper function to render markdown-like content with better styling
  const renderMarkdown = (text) => {
    if (!text) return '';

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let listType = null;
    let inTable = false;
    let tableRows = [];

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = listType === 'ordered' ? 'ol' : 'ul';
        elements.push(
          <ListTag 
            key={`list-${elements.length}`} 
            className={`space-y-2 mb-6 ${listType === 'ordered' ? 'list-decimal' : 'list-disc'} list-inside ml-4 text-text-light/90`}
          >
            {listItems}
          </ListTag>
        );
        listItems = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-8">
            <table className="min-w-full border border-white/20 rounded-lg overflow-hidden">
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} className={i === 0 ? 'bg-accent-orange/10 font-semibold' : 'hover:bg-white/5'}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-white/10 px-4 py-3 text-text-light/90">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, idx) => {
      // Table detection
      if (line.includes('|')) {
        flushList();
        const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
        if (cells.length > 0) {
          tableRows.push(cells);
          inTable = true;
          return;
        }
      } else if (inTable) {
        flushTable();
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList();
        flushTable();
        elements.push(
          <h1 
            key={idx} 
            className="text-4xl font-bold text-text-light mt-12 mb-6 first:mt-0 leading-tight"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        flushTable();
        elements.push(
          <h2 key={idx} className="text-3xl font-bold text-text-light mt-10 mb-5 pb-3 border-b-2 border-white/20">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        flushTable();
        elements.push(
          <h3 key={idx} className="text-2xl font-semibold text-text-light mt-8 mb-4">
            {line.substring(4)}
          </h3>
        );
      }
      // Lists
      else if (line.match(/^\d+\.\s/)) {
        flushTable();
        if (listType !== 'ordered') {
          flushList();
          listType = 'ordered';
        }
        listItems.push(
          <li key={idx} className="leading-relaxed ml-2 text-base">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        flushTable();
        if (listType !== 'unordered') {
          flushList();
          listType = 'unordered';
        }
        listItems.push(
          <li key={idx} className="leading-relaxed ml-2 text-base">
            {line.substring(2)}
          </li>
        );
      }
      // Horizontal rules
      else if (line.trim() === '---') {
        flushList();
        flushTable();
        elements.push(
          <hr key={idx} className="border-white/20 my-8" />
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        // Skip empty lines between list items
        if (listType || inTable) return;
        flushList();
        flushTable();
      }
      // Regular paragraphs
      else if (line.trim() && !inTable) {
        flushList();
        flushTable();
        // Enhanced text formatting
        let formattedText = line
          .replace(/\*\*(.+?)\*\*/g, '<strong class="text-accent-orange font-semibold">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="text-text-light italic">$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-card-bg/40 px-2 py-0.5 rounded text-accent-orange text-sm font-mono">$1</code>');
        
        elements.push(
          <p 
            key={idx} 
            className="text-text-light/90 leading-relaxed mb-4 text-base"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    });

    flushList();
    flushTable();
    return elements;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.updateContent(contentId, formData);
      router.push('/content');
    } catch (error) {
      console.error('Update content error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          <span className="mt-4 text-text-muted block">Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-bg border-b border-white/10 sticky top-0 z-40 backdrop-blur-sm bg-dark-bg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/content"
                  className="p-2 hover:bg-card-bg/20 rounded-lg transition-colors text-text-light"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-text-light">Edit Content</h1>
                  <p className="text-text-muted mt-1">Update and refine your content</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-accent-orange/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="glass rounded-xl border border-white/10 p-6 shadow-xl">
            <h2 className="text-xl font-bold text-text-light mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-orange" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4 text-accent-orange" />
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter content title..."
                  className={`w-full px-4 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.title ? 'border-red-500' : 'border-white/20'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-orange" />
                  Content Type
                </label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                  className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                >
                  <option value="article">Article</option>
                  <option value="blog-post">Blog Post</option>
                  <option value="social-media">Social Media</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-text-light mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-accent-orange" />
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Content Body Card */}
          <div className={`glass rounded-xl border border-white/10 shadow-xl ${isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}>
            <div className="sticky top-0 bg-card-bg/90 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-text-light flex items-center gap-2">
                <Code className="w-5 h-5 text-accent-orange" />
                Content Body
              </h2>

              <div className="flex items-center gap-2">
                {/* View Mode Tabs */}
                <div className="flex items-center gap-1 bg-dark-bg/50 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'preview' 
                        ? 'bg-accent-orange text-white' 
                        : 'text-text-muted hover:text-text-light hover:bg-white/5'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'edit' 
                        ? 'bg-accent-orange text-white' 
                        : 'text-text-muted hover:text-text-light hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('raw')}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all flex items-center gap-2 ${
                      viewMode === 'raw' 
                        ? 'bg-accent-orange text-white' 
                        : 'text-text-muted hover:text-text-light hover:bg-white/5'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    JSON
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 text-text-muted hover:text-text-light hover:bg-white/10 rounded-lg transition-colors"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Preview Mode - Beautifully Rendered Content */}
              {viewMode === 'preview' && parsedContent && (
                <div className="max-w-4xl mx-auto">
                  {/* Show research data if available */}
                  {parsedContent.topic && (
                    <div className="mb-8 p-6 bg-card-bg/30 border border-white/10 rounded-lg">
                      <h3 className="text-lg font-semibold text-text-light mb-3 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-accent-orange" />
                        Research Topic
                      </h3>
                      <p className="text-text-light/80">{parsedContent.topic}</p>
                      
                      {parsedContent.summary && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-text-light mb-2">Summary</h4>
                          <p className="text-text-light/70 text-sm leading-relaxed">{parsedContent.summary}</p>
                        </div>
                      )}
                      
                      {parsedContent.key_findings && parsedContent.key_findings.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-text-light mb-2">Key Findings</h4>
                          <ul className="list-disc list-inside space-y-1 text-text-light/70 text-sm">
                            {parsedContent.key_findings.map((finding, idx) => (
                              <li key={idx}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="prose prose-invert prose-lg max-w-none">
                    {parsedContent.content && (
                      <div className="space-y-4">
                        {renderMarkdown(parsedContent.content)}
                      </div>
                    )}

                    {/* Metadata Footer */}
                    {(parsedContent.word_count || parsedContent.generated_at) && (
                      <div className="mt-12 pt-6 border-t border-white/10">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                          {parsedContent.word_count && (
                            <div className="flex items-center gap-2">
                              <Hash className="w-4 h-4" />
                              <span>{parsedContent.word_count} words</span>
                            </div>
                          )}
                          {parsedContent.generated_at && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Generated: {new Date(parsedContent.generated_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewMode === 'preview' && !parsedContent && formData.body && (
                <div className="max-w-4xl mx-auto">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div className="space-y-4">
                      {renderMarkdown(formData.body)}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'preview' && !parsedContent && !formData.body && (
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
                  <p className="text-text-muted text-lg">No content available</p>
                  <p className="text-sm text-text-muted mt-2">Switch to Edit mode to add content</p>
                </div>
              )}

              {/* Edit Mode - Editable Textarea */}
              {viewMode === 'edit' && (
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    {parsedContent ? 'Edit Generated Content' : 'Content'}
                  </label>
                  <textarea
                    value={parsedContent?.content || formData.body}
                    onChange={(e) => {
                      if (parsedContent) {
                        setParsedContent({ ...parsedContent, content: e.target.value });
                        setFormData({
                          ...formData,
                          body: JSON.stringify({ ...parsedContent, content: e.target.value })
                        });
                      } else {
                        setFormData({ ...formData, body: e.target.value });
                      }
                    }}
                    placeholder="Write your content here..."
                    rows={30}
                    className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all resize-none font-mono text-sm leading-relaxed"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-4">
                      <span>{(parsedContent?.content || formData.body).length} characters</span>
                      <span>•</span>
                      <span>{Math.round((parsedContent?.content || formData.body).split(/\s+/).filter(Boolean).length)} words</span>
                    </div>
                    <span className="text-accent-orange">Markdown supported</span>
                  </div>
                </div>
              )}

              {/* Raw JSON Mode */}
              {viewMode === 'raw' && (
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">Raw JSON Data</label>
                  <pre className="w-full px-6 py-4 bg-dark-bg border border-white/20 rounded-lg text-text-light text-xs font-mono overflow-auto max-h-[700px] leading-relaxed">
                    {JSON.stringify(parsedContent || formData.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}