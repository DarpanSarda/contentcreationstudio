// app/content/new/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Send,
  Calendar,
  FileText,
  Hash,
  Target,
  Search,
  Image,
  Clock,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function NewContentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'blog-post',
    targetPlatforms: [],
    tone: 'professional',
    wordCount: 1000,
    targetAudience: '',
    keywords: [],
    researchDepth: 'standard',
    includeImages: false,
    numberOfImages: 3,
    scheduleOption: 'now',
    scheduledDateTime: '',
    additionalInstructions: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const contentTypes = [
    { value: 'blog-post', label: 'Blog Post', icon: <FileText className="w-4 h-4" /> },
    { value: 'twitter-thread', label: 'Twitter Thread', icon: <Hash className="w-4 h-4" /> },
    { value: 'linkedin-post', label: 'LinkedIn Post', icon: <Target className="w-4 h-4" /> },
    { value: 'instagram-caption', label: 'Instagram Caption', icon: <Image className="w-4 h-4" /> },
    { value: 'facebook-post', label: 'Facebook Post', icon: <FileText className="w-4 h-4" /> },
    { value: 'email-newsletter', label: 'Email Newsletter', icon: <Send className="w-4 h-4" /> }
  ];

  const platforms = [
    { value: 'wordpress', label: 'WordPress' },
    { value: 'medium', label: 'Medium' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'technical', label: 'Technical' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'formal', label: 'Formal' }
  ];

  const researchDepths = [
    { value: 'quick', label: 'Quick', description: 'Basic research, 5-10 minutes' },
    { value: 'standard', label: 'Standard', description: 'Comprehensive research, 15-20 minutes' },
    { value: 'deep', label: 'Deep', description: 'Extensive research, 30+ minutes' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic || formData.topic.trim().length < 5) {
      newErrors.topic = 'Topic must be at least 5 characters';
    }

    if (formData.targetPlatforms.length === 0) {
      newErrors.targetPlatforms = 'Please select at least one platform';
    }

    if (formData.wordCount < 100 || formData.wordCount > 5000) {
      newErrors.wordCount = 'Word count must be between 100 and 5000';
    }

    if (formData.scheduleOption === 'scheduled' && !formData.scheduledDateTime) {
      newErrors.scheduledDateTime = 'Please select a date and time for scheduled posts';
    }

    if (formData.includeImages && formData.numberOfImages < 1) {
      newErrors.numberOfImages = 'Number of images must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Content creation request:', formData);

      // Redirect to workflow progress page
      router.push('/agents');
    } catch (error) {
      console.error('Content creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter(p => p !== platform)
        : [...prev.targetPlatforms, platform]
    }));
  };

  const addKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleKeywordKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const saveAsTemplate = () => {
    // TODO: Implement save as template functionality
    console.log('Saving as template...');
  };

  const getWordCountLabel = (count) => {
    if (count < 300) return 'Short';
    if (count < 800) return 'Medium';
    if (count < 1500) return 'Long';
    return 'Very Long';
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="p-2 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-text-light" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-text-light">Create New Content</h1>
                <p className="text-sm text-text-muted">Fill in the details to start creating amazing content</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Preview</span>
              </button>
              <button
                onClick={saveAsTemplate}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Template</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-text-light mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-orange" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Topic/Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Topic or Title <span className="text-accent-orange">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className={`w-full px-4 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all ${
                    errors.topic ? 'border-red-500' : 'border-white/20'
                  }`}
                  placeholder="Enter your content topic or title"
                  disabled={isLoading}
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.topic}
                  </p>
                )}
              </div>

              {/* Content Type */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, contentType: type.value }))}
                      className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                        formData.contentType === type.value
                          ? 'bg-accent-orange/20 border-accent-orange text-accent-orange'
                          : 'border-white/20 hover:bg-card-bg/20 text-text-light'
                      }`}
                    >
                      {type.icon}
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Target Platforms <span className="text-accent-orange">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`p-3 border rounded-lg transition-all ${
                        formData.targetPlatforms.includes(platform.value)
                          ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan'
                          : 'border-white/20 hover:bg-card-bg/20 text-text-light'
                      }`}
                    >
                      <span className="text-sm font-medium">{platform.label}</span>
                    </button>
                  ))}
                </div>
                {errors.targetPlatforms && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.targetPlatforms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Details */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-text-light mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-cyan" />
              Content Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tone/Style */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Tone & Style
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                >
                  {tones.map((tone) => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Word Count */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Word Count
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={formData.wordCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, wordCount: parseInt(e.target.value) }))}
                    className="w-full accent-accent-orange"
                    disabled={isLoading}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light font-medium">{formData.wordCount} words</span>
                    <span className="text-xs text-text-muted">({getWordCountLabel(formData.wordCount)})</span>
                  </div>
                </div>
                {errors.wordCount && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.wordCount}
                  </p>
                )}
              </div>

              {/* Target Audience */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                  placeholder="e.g., Marketing professionals, startup founders, tech enthusiasts"
                  disabled={isLoading}
                />
              </div>

              {/* Keywords */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Keywords
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentKeyword}
                      onChange={(e) => setCurrentKeyword(e.target.value)}
                      onKeyPress={handleKeywordKeyPress}
                      className="flex-1 px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all"
                      placeholder="Add keyword and press Enter"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={addKeyword}
                      className="px-4 py-3 bg-accent-cyan hover:bg-opacity-90 text-white rounded-lg transition-colors"
                      disabled={isLoading || !currentKeyword.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-accent-orange/20 text-accent-orange rounded-full text-sm"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="hover:bg-accent-orange/30 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Research & Media */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-text-light mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-accent-yellow" />
              Research & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Research Depth */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Research Depth
                </label>
                <div className="space-y-3">
                  {researchDepths.map((depth) => (
                    <label key={depth.value} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="researchDepth"
                        value={depth.value}
                        checked={formData.researchDepth === depth.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, researchDepth: e.target.value }))}
                        className="mt-1 accent-accent-orange"
                        disabled={isLoading}
                      />
                      <div>
                        <span className="text-sm font-medium text-text-light">{depth.label}</span>
                        <p className="text-xs text-text-muted">{depth.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Include Images */}
              <div>
                <label className="block text-sm font-medium text-text-light mb-4">
                  Include Images
                </label>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeImages}
                      onChange={(e) => setFormData(prev => ({ ...prev, includeImages: e.target.checked }))}
                      className="w-4 h-4 accent-accent-orange"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-medium text-text-light">Generate AI images</span>
                  </label>

                  {formData.includeImages && (
                    <div>
                      <label className="block text-sm text-text-muted mb-2">
                        Number of Images
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.numberOfImages}
                        onChange={(e) => setFormData(prev => ({ ...prev, numberOfImages: parseInt(e.target.value) || 1 }))}
                        className={`w-full px-4 py-2 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all ${
                          errors.numberOfImages ? 'border-red-500' : 'border-white/20'
                        }`}
                        disabled={isLoading}
                      />
                      {errors.numberOfImages && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.numberOfImages}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-text-light mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-green" />
              Scheduling Options
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: 'now', label: 'Publish Now', icon: <Zap className="w-4 h-4" /> },
                  { value: 'scheduled', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
                  { value: 'draft', label: 'Save as Draft', icon: <FileText className="w-4 h-4" /> }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, scheduleOption: option.value }))}
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-all ${
                      formData.scheduleOption === option.value
                        ? 'bg-accent-green/20 border-accent-green text-accent-green'
                        : 'border-white/20 hover:bg-card-bg/20 text-text-light'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              {formData.scheduleOption === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Scheduled Date & Time <span className="text-accent-orange">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDateTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDateTime: e.target.value }))}
                    className={`w-full px-4 py-3 bg-card-bg/20 border rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all ${
                      errors.scheduledDateTime ? 'border-red-500' : 'border-white/20'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.scheduledDateTime && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.scheduledDateTime}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Additional Instructions */}
          <div className="glass rounded-xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-text-light mb-4">Additional Instructions</h2>
            <textarea
              value={formData.additionalInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalInstructions: e.target.value }))}
              className="w-full px-4 py-3 bg-card-bg/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted transition-all resize-none"
              rows={4}
              placeholder="Any specific requirements, style preferences, or additional information for the content..."
              disabled={isLoading}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-white/20 rounded-lg hover:bg-card-bg/20 transition-colors text-text-light"
              disabled={isLoading}
            >
              Cancel
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 bg-accent-cyan hover:bg-opacity-90 text-dark-bg rounded-lg font-semibold transition-colors"
                disabled={isLoading}
              >
                Preview Content
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-accent-orange hover:bg-opacity-90 text-white rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-accent-orange/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Content...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Start Creating
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}