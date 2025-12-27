// app/content/new/page.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import {
  ArrowLeft,
  Save,
  FileText,
  AlertCircle,
  Search,
  PenTool,
  Image,
  Video,
  Send,
  ChevronDown
} from 'lucide-react';

export default function NewContentPage() {
  const router = useRouter();
  const toast = useToast();

  const [activeSteps, setActiveSteps] = useState({
    research: false,
    writing: false,
    image: false,
    video: false,
    publish: false
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);


  const [formData, setFormData] = useState({
    topic: '',
    depth: 'standard',
    content_type: 'article',
    length: 50,
    include_seo: 'yes',
    use_brand_voice: 'yes',
    image_style: 'realistic',
    image_count: '1',
    video_duration: '30',
    video_style: 'professional',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const contentTypes = [
    { value: 'article', label: 'Article' },
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'email', label: 'Email' },
  ];

  const depthOptions = [
    { value: 'brief', label: 'Brief Overview' },
    { value: 'standard', label: 'Standard Research' },
    { value: 'comprehensive', label: 'Comprehensive Analysis' },
    { value: 'expert', label: 'Expert Deep Dive' },
  ];

  const imageStyles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'artistic', label: 'Artistic' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'illustrative', label: 'Illustrative' },
  ];

  const videoStyles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'animated', label: 'Animated' },
  ];

  const getLengthLabel = (value) => {
    if (value < 33) return 'Short';
    if (value < 67) return 'Medium';
    return 'Long';
  };

  const toggleStep = (step) => {
    setActiveSteps(prev => ({ ...prev, [step]: !prev[step] }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.topic.trim()) {
      newErrors.topic = 'Topic is required';
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
      // Build workflow stages based on active steps
      const stages = [];
      if (activeSteps.research) stages.push('research');
      if (activeSteps.writing) stages.push('writing');
      if (activeSteps.image) stages.push('image');
      if (activeSteps.publish) stages.push('publishing');

      // Build workflow options
      const workflowData = {
        topic: formData.topic,
        stages: stages.length > 0 ? stages : ['research', 'writing'],
        research_options: {
          depth: formData.depth
        },
        writing_options: {
          content_type: formData.content_type,
          length: formData.length,
          include_seo: formData.include_seo === 'yes',
          use_brand_voice: formData.use_brand_voice === 'yes'
        }
      };

      if (activeSteps.image) {
        workflowData.image_options = {
          style: formData.image_style,
          num_images: parseInt(formData.image_count)
        };
      }

      if (activeSteps.publish && selectedPlatforms.length > 0) {
        workflowData.publishing_options = {
          platforms: selectedPlatforms,
          wordpress: {
            status: formData.status // draft, publish, pending
          }
        };
      }

      const response = await apiClient.startWorkflow(workflowData);
      router.push('/content');
    } catch (error) {
      console.error('Workflow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const handleSaveDraft = async () => {
    if (!formData.topic.trim()) {
      toast.error('Topic is required');
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.createContent({
        title: formData.topic,
        body: '',
        status: 'draft',
        content_type: formData.content_type
      });
      toast.success('Draft saved successfully');
      router.push('/content');
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsLoading(false);
    }
  };

  const StepCard = ({ step, icon: Icon, title, color, children, disabled = false }) => {
    const isActive = activeSteps[step];

    return (
      <div className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${disabled ? 'border-white/10 opacity-60' : isActive
        ? `border-${color}/50 shadow-lg shadow-${color}/10`
        : 'border-white/10 hover:border-white/20'
        }`}>
        <div
          className={`p-6 cursor-pointer transition-all ${isActive ? 'bg-gradient-to-r from-card-bg/40 to-transparent' : 'hover:bg-card-bg/20'
            }`}
          onClick={() => !disabled && toggleStep(step)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-all ${isActive
                ? `bg-${color}/20 text-${color}`
                : 'bg-card-bg/40 text-text-muted'
                }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-light">{title}</h3>
                <p className="text-sm text-text-muted mt-0.5">
                  {disabled ? 'This feature will be available soon' : isActive ? 'Click to collapse' : 'Click to enable and configure'}
                </p>
              </div>
            </div>
            {!disabled && (
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleStep(step)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-card-bg/60 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent-cyan rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                </label>
                <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isActive ? 'rotate-180' : ''
                  }`} />
              </div>
            )}
          </div>
        </div>

        {!disabled && (
          <div className={`transition-all duration-300 ease-in-out ${isActive ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}>
            <div className="px-6 pb-6 pt-2 border-t border-white/10">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-card-bg/20">
      {/* Header */}
      <div className="bg-dark-bg/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  href="/content"
                  className="p-2 hover:bg-card-bg/40 rounded-xl transition-all hover:scale-105 text-text-light"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-orange bg-clip-text text-transparent">
                    Create New Content
                  </h1>
                  <p className="text-text-muted mt-1">Configure your AI-powered content generation</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="px-5 py-2.5 border border-white/20 rounded-xl hover:bg-card-bg/40 transition-all hover:scale-105 text-text-light disabled:opacity-50 disabled:hover:scale-100 font-medium"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-accent-orange to-accent-orange/80 hover:from-accent-orange/90 hover:to-accent-orange/70 text-white rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-accent-orange/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Topic Input - Always Visible */}
          <div className="glass rounded-2xl border border-white/10 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20">
                <FileText className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-light">Content Topic</h2>
                <p className="text-sm text-text-muted mt-0.5">What would you like to create content about?</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-3">
                Topic <span className="text-accent-orange">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., The Future of Artificial Intelligence in Healthcare..."
                className={`w-full px-5 py-4 bg-card-bg/40 border rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light placeholder-text-muted/60 transition-all text-lg ${errors.topic ? 'border-red-500' : 'border-white/20'
                  }`}
              />
              {errors.topic && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.topic}
                </p>
              )}
            </div>
          </div>

          {/* Configuration Steps */}
          <div className="space-y-4">
            {/* Research Step */}
            <StepCard step="research" icon={Search} title="Research" color="accent-purple">
              <div className="space-y-5 mt-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    Research Depth
                  </label>
                  <select
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                    className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text-light transition-all"
                  >
                    {depthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-text-muted">
                    Controls how thorough the research and analysis will be
                  </p>
                </div>
              </div>
            </StepCard>

            {/* Writing Step */}
            <StepCard step="writing" icon={PenTool} title="Writing" color="accent-cyan">
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Content Type
                    </label>
                    <select
                      value={formData.content_type}
                      onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                    >
                      {contentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Length Slider */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    Content Length: <span className="text-accent-cyan font-bold">{getLengthLabel(formData.length)}</span>
                  </label>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: parseInt(e.target.value) })}
                      className="w-full h-3 bg-card-bg/40 rounded-full appearance-none cursor-pointer slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #00d4ff ${formData.length}%, rgba(255,255,255,0.1) ${formData.length}%)`
                      }}
                    />
                    <div className="flex justify-between mt-3 text-xs font-medium">
                      <span className="text-text-muted">Short</span>
                      <span className="text-text-muted">Medium</span>
                      <span className="text-text-muted">Long</span>
                    </div>
                  </div>
                </div>

                {/* Toggle Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  {/* Include SEO */}
                  <div className="p-4 bg-card-bg/20 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Include SEO Optimization
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="include_seo"
                          value="yes"
                          checked={formData.include_seo === 'yes'}
                          onChange={(e) => setFormData({ ...formData, include_seo: e.target.value })}
                          className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan focus:ring-2 cursor-pointer"
                        />
                        <span className="text-text-light group-hover:text-accent-cyan transition-colors">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="include_seo"
                          value="no"
                          checked={formData.include_seo === 'no'}
                          onChange={(e) => setFormData({ ...formData, include_seo: e.target.value })}
                          className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan focus:ring-2 cursor-pointer"
                        />
                        <span className="text-text-light group-hover:text-accent-cyan transition-colors">No</span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-text-muted">
                      Optimize for search engines
                    </p>
                  </div>

                  {/* Use Brand Voice */}
                  <div className="p-4 bg-card-bg/20 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Use Brand Voice
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="use_brand_voice"
                          value="yes"
                          checked={formData.use_brand_voice === 'yes'}
                          onChange={(e) => setFormData({ ...formData, use_brand_voice: e.target.value })}
                          className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan focus:ring-2 cursor-pointer"
                        />
                        <span className="text-text-light group-hover:text-accent-cyan transition-colors">Yes</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="use_brand_voice"
                          value="no"
                          checked={formData.use_brand_voice === 'no'}
                          onChange={(e) => setFormData({ ...formData, use_brand_voice: e.target.value })}
                          className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan focus:ring-2 cursor-pointer"
                        />
                        <span className="text-text-light group-hover:text-accent-cyan transition-colors">No</span>
                      </label>
                    </div>
                    <p className="mt-2 text-xs text-text-muted">
                      Apply your brand tone
                    </p>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Image Generation Step */}
            <StepCard step="image" icon={Image} disabled={true} title={
              <div className="flex items-center gap-2">
                <span>Image Generation</span>
                <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs font-medium rounded-full">
                  Coming Soon
                </span>
              </div>
            } color="accent-orange">
              <div className="space-y-5 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Image Style
                    </label>
                    <select
                      value={formData.image_style}
                      onChange={(e) => setFormData({ ...formData, image_style: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-transparent text-text-light transition-all"
                    >
                      {imageStyles.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Number of Images
                    </label>
                    <select
                      value={formData.image_count}
                      onChange={(e) => setFormData({ ...formData, image_count: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-orange focus:border-transparent text-text-light transition-all"
                    >
                      <option value="1">1 Image</option>
                      <option value="2">2 Images</option>
                      <option value="3">3 Images</option>
                      <option value="5">5 Images</option>
                    </select>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Video Generation Step */}
            <StepCard step="video" icon={Video} disabled={true} title={
              <div className="flex items-center gap-2">
                <span>Video Generation</span>
                <span className="px-2 py-0.5 bg-accent-yellow/20 text-accent-yellow text-xs font-medium rounded-full">
                  Coming Soon
                </span>
              </div>
            } color="accent-purple">
              <div className="space-y-5 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Video Style
                    </label>
                    <select
                      value={formData.video_style}
                      onChange={(e) => setFormData({ ...formData, video_style: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text-light transition-all"
                    >
                      {videoStyles.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-light mb-3">
                      Video Duration
                    </label>
                    <select
                      value={formData.video_duration}
                      onChange={(e) => setFormData({ ...formData, video_duration: e.target.value })}
                      className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text-light transition-all"
                    >
                      <option value="15">15 seconds</option>
                      <option value="30">30 seconds</option>
                      <option value="60">1 minute</option>
                      <option value="120">2 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </StepCard>

            {/* Publish Step */}
            <StepCard step="publish" icon={Send} title="Publish Settings" color="accent-cyan">
              <div className="space-y-5 mt-4">
                <div className="p-5 bg-gradient-to-r from-accent-cyan/10 to-transparent rounded-xl border border-accent-cyan/20">
                  <h4 className="text-sm font-semibold text-accent-cyan mb-2">Auto-Publish</h4>
                  <p className="text-sm text-text-muted">
                    Configure automatic publishing to your connected platforms after content generation.
                  </p>
                </div>

                {/* Publishing Status */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    Publishing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3.5 bg-card-bg/40 border border-white/20 rounded-xl focus:ring-2 focus:ring-accent-cyan focus:border-transparent text-text-light transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="publish">Publish Immediately</option>
                    <option value="pending">Pending Review</option>
                  </select>
                  <p className="mt-2 text-xs text-text-muted">
                    Status for published content on platforms
                  </p>
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-text-light mb-3">
                    Select Platforms
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label
                      className={`flex items-center gap-3 p-4 bg-card-bg/20 rounded-xl border cursor-pointer transition-all ${selectedPlatforms.includes('wordpress')
                        ? 'border-accent-cyan bg-accent-cyan/10'
                        : 'border-white/10 hover:border-accent-cyan/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('wordpress')}
                        onChange={() => handlePlatformToggle('wordpress')}
                        className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan rounded"
                      />
                      <span className="text-text-light font-medium">WordPress</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 bg-card-bg/20 rounded-xl border cursor-pointer transition-all ${selectedPlatforms.includes('medium')
                        ? 'border-accent-cyan bg-accent-cyan/10'
                        : 'border-white/10 hover:border-accent-cyan/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('medium')}
                        onChange={() => handlePlatformToggle('medium')}
                        className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan rounded"
                      />
                      <span className="text-text-light font-medium">Medium</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 bg-card-bg/20 rounded-xl border cursor-pointer transition-all ${selectedPlatforms.includes('linkedin')
                        ? 'border-accent-cyan bg-accent-cyan/10'
                        : 'border-white/10 hover:border-accent-cyan/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('linkedin')}
                        onChange={() => handlePlatformToggle('linkedin')}
                        className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan rounded"
                      />
                      <span className="text-text-light font-medium">LinkedIn</span>
                    </label>
                    <label
                      className={`flex items-center gap-3 p-4 bg-card-bg/20 rounded-xl border cursor-pointer transition-all ${selectedPlatforms.includes('twitter')
                        ? 'border-accent-cyan bg-accent-cyan/10'
                        : 'border-white/10 hover:border-accent-cyan/50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes('twitter')}
                        onChange={() => handlePlatformToggle('twitter')}
                        className="w-4 h-4 text-accent-cyan focus:ring-accent-cyan rounded"
                      />
                      <span className="text-text-light font-medium">Twitter</span>
                    </label>
                  </div>
                  {selectedPlatforms.length > 0 && (
                    <div className="mt-3 p-3 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20">
                      <p className="text-sm text-accent-cyan">
                        ✓ Content will be published to: {selectedPlatforms.join(', ')}
                      </p>
                    </div>
                  )}
                  {selectedPlatforms.length === 0 && activeSteps.publish && (
                    <div className="mt-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-sm text-yellow-500">
                        ⚠ Please select at least one platform to publish
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </StepCard>
          </div>

          {/* Summary Card */}
          {Object.values(activeSteps).some(v => v) && (
            <div className="glass rounded-2xl border border-accent-cyan/30 bg-gradient-to-r from-accent-cyan/5 to-transparent p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent-cyan/20">
                  <FileText className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-light mb-2">Generation Summary</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeSteps.research && (
                      <span className="px-3 py-1.5 bg-accent-purple/20 text-accent-purple rounded-lg text-sm font-medium">
                        Research Enabled
                      </span>
                    )}
                    {activeSteps.writing && (
                      <span className="px-3 py-1.5 bg-accent-cyan/20 text-accent-cyan rounded-lg text-sm font-medium">
                        Writing Enabled
                      </span>
                    )}
                    {activeSteps.image && (
                      <span className="px-3 py-1.5 bg-accent-orange/20 text-accent-orange rounded-lg text-sm font-medium">
                        Images Enabled
                      </span>
                    )}
                    {activeSteps.video && (
                      <span className="px-3 py-1.5 bg-accent-purple/20 text-accent-purple rounded-lg text-sm font-medium">
                        Video Enabled
                      </span>
                    )}
                    {activeSteps.publish && (
                      <span className="px-3 py-1.5 bg-accent-cyan/20 text-accent-cyan rounded-lg text-sm font-medium">
                        Auto-Publish Enabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </main>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
          transition: all 0.2s;
        }
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
        }
      `}</style>
    </div>
  );
}