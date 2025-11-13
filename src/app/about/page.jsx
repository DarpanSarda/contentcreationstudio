// app/about/page.jsx
'use client';
import { useState } from 'react';
import {
  Users,
  Target,
  Lightbulb,
  Award,
  Globe,
  Heart,
  Calendar,
  TrendingUp,
  Zap,
  Shield,
  Star,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  const [expandedTimeline, setExpandedTimeline] = useState(2023);

  const timeline = [
    {
      year: 2023,
      title: "The Beginning",
      description: "Founded with a vision to revolutionize content creation using AI technology",
      achievements: [
        "Seed funding secured",
        "Core team assembled",
        "Initial MVP development"
      ]
    },
    {
      year: 2024,
      title: "Rapid Growth",
      description: "Launched our public beta and onboarded our first 1000+ users",
      achievements: [
        "Public beta launch",
        "1000+ active users",
        "Partnership with major platforms",
        "Series A funding"
      ]
    },
    {
      year: 2025,
      title: "Market Leadership",
      description: "Established as the leading AI-powered content creation platform",
      achievements: [
        "10,000+ users worldwide",
        "Advanced AI agent system",
        "Enterprise features launched",
        "Global expansion"
      ]
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP of AI at Google, 15+ years in machine learning and content technology",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Meta engineering lead, expert in scalable systems and AI infrastructure",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Emily Thompson",
      role: "Head of Product",
      bio: "Product leader from Notion, passionate about user experience and design",
      image: "/api/placeholder/300/300"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Former senior engineer at OpenAI, specializes in large language models",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Lisa Johnson",
      role: "Head of Design",
      bio: "Award-winning designer from Apple, focused on intuitive user interfaces",
      image: "/api/placeholder/300/300"
    },
    {
      name: "Michael Brown",
      role: "Head of Marketing",
      bio: "Growth marketing expert from Stripe, helped scale multiple startups",
      image: "/api/placeholder/300/300"
    }
  ];

  const stats = [
    { label: "Users Worldwide", value: "10,000+", icon: Users },
    { label: "Content Created", value: "1M+", icon: Target },
    { label: "AI Agents", value: "50+", icon: Zap },
    { label: "Platform Integrations", value: "15+", icon: Globe },
    { label: "Uptime", value: "99.9%", icon: Shield },
    { label: "Support Response", value: "< 2hrs", icon: Mail }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly pushing the boundaries of what's possible with AI technology"
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every decision starts with how it will benefit our users"
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Building tools that our users can depend on every day"
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Deeply passionate about helping creators bring their ideas to life"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            About Content Studio
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize content creation and empower creators worldwide
            with the power of artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 md:p-12 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Mission</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                To make professional content creation accessible to everyone, regardless of
                their technical expertise or budget. We believe that great ideas deserve to be
                shared, and AI should be the tool that helps bring those ideas to life.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By combining cutting-edge artificial intelligence with intuitive design, we're
                building the future of content creation—one where technology amplifies human
                creativity rather than replaces it.
              </p>
            </div>
            <div className="text-center">
              <Target className="w-32 h-32 mx-auto text-purple-400 mb-4" />
              <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-2">Empowering Creators</h3>
                <p className="text-gray-400">From bloggers to businesses, we help everyone tell their story</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:bg-purple-500/10 transition-all"
                >
                  <Icon className="w-8 h-8 mx-auto text-purple-400 mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden cursor-pointer transition-all hover:bg-purple-500/10 ${
                  expandedTimeline === item.year ? 'ring-2 ring-purple-400' : ''
                }`}
                onClick={() => setExpandedTimeline(expandedTimeline === item.year ? null : item.year)}
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-500/20 rounded-full p-3">
                        <Calendar className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-400">{item.year}</h3>
                        <p className="text-lg font-semibold">{item.title}</p>
                      </div>
                    </div>
                    <TrendingUp className={`w-5 h-5 transition-transform ${
                      expandedTimeline === item.year ? 'rotate-180' : ''
                    }`} />
                  </div>
                  <p className="text-gray-300 mb-4">{item.description}</p>
                  {expandedTimeline === item.year && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <h4 className="font-semibold mb-3 text-purple-300">Key Achievements</h4>
                      <ul className="space-y-2">
                        {item.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300">
                            <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 text-center hover:bg-purple-500/10 transition-all group"
                >
                  <div className="bg-purple-500/20 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-purple-400">{value.title}</h3>
                  <p className="text-gray-300 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-purple-500/10 transition-all group"
              >
                <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-purple-400">{member.name}</h3>
                  <p className="text-purple-300 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
            <p className="text-xl mb-8 text-purple-100">
              We're always looking for talented people who share our vision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/careers"
                className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              >
                View Open Positions
              </a>
              <a
                href="/contact"
                className="px-8 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-400 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}