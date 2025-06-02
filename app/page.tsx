'use client'

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Zap, Shield, Target, Users, Sparkles, ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"

// Type-safe motion components
const MotionDiv = motion.div as any
const MotionA = motion.a as any
const MotionButton = motion.button as any
const MotionH1 = motion.h1 as any
const MotionH2 = motion.h2 as any
const MotionP = motion.p as any
const MotionSpan = motion.span as any
// const MotionNav = motion.nav as any
const MotionUl = motion.ul as any
const MotionLi = motion.li as any
const MotionSection = motion.section as any
const MotionFooter = motion.footer as any

export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef as React.RefObject<HTMLElement>,
        offset: ["start start", "end start"]
    })
    
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    // Animation variants
    const staggerContainer = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const staggerItem = {
        initial: { opacity: 0, y: 20 },
        animate: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    const navigationItems = [
        { name: 'Problems', href: '#problems' },
        { name: 'Features', href: '#features' },
        { name: 'Benefits', href: '#benefits' },
        { name: 'Pricing', href: '#pricing' }
    ]

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        const element = document.querySelector(href) as HTMLElement
        if (element) {
            const offsetTop = element.offsetTop - 80 // Account for sticky nav
            window.scrollTo({ top: offsetTop, behavior: 'smooth' })
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
            {/* Navigation */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm bg-white/80 dark:bg-black/80 sticky top-0 z-50">
                <MotionDiv 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <MotionDiv 
                        className="w-8 h-8 bg-black dark:bg-white rounded-sm"
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    />
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-xl font-medium tracking-wide font-heading lg:hover:text-gray-600 dark:lg:hover:text-gray-300 transition-colors"
                    >
                        Life OS
                    </button>
                </MotionDiv>
                
                {/* Desktop Navigation Links */}
                <MotionDiv 
                    className="hidden md:flex items-center space-x-8"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                >
                    {navigationItems.map((item) => (
                        <MotionA
                            key={item.name}
                            href={item.href}
                            variants={staggerItem}
                            className="text-sm text-gray-600 dark:text-gray-400 lg:hover:text-black dark:lg:hover:text-white transition-colors relative group"
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, item.href)}
                            whileHover={{ y: -2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            {item.name}
                            <MotionDiv 
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.2 }}
                            />
                        </MotionA>
                    ))}
                </MotionDiv>

                {/* Desktop CTA Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/login" className="text-sm lg:hover:underline">Sign In</Link>
                    </MotionDiv>
                    <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button size="sm" className="bg-black dark:bg-white text-white dark:text-black lg:hover:bg-gray-800 dark:lg:hover:bg-gray-200">
                            Get Started
                        </Button>
                    </MotionDiv>
                </div>

                {/* Mobile Menu Button */}
                <MotionButton
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <MotionDiv
                        animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </MotionDiv>
                </MotionButton>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <MotionDiv
                    className="md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-sm"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex flex-col items-center justify-center h-full space-y-8">
                        <MotionDiv 
                            className="flex flex-col items-center space-y-6"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            {navigationItems.map((item) => (
                                <MotionA
                                    key={item.name}
                                    href={item.href}
                                    variants={staggerItem}
                                    className="text-2xl font-medium text-gray-600 dark:text-gray-400 lg:hover:text-black dark:lg:hover:text-white transition-colors"
                                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                        handleNavClick(e, item.href)
                                        setIsMobileMenuOpen(false)
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.name}
                                </MotionA>
                            ))}
                        </MotionDiv>
                        
                        <MotionDiv 
                            className="flex flex-col items-center space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                        >
                            <MotionDiv variants={staggerItem}>
                                <Link 
                                    href="/login" 
                                    className="text-lg lg:hover:underline"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </MotionDiv>
                            <MotionDiv variants={staggerItem}>
                                <Button 
                                    size="lg" 
                                    className="bg-black dark:bg-white text-white dark:text-black lg:hover:bg-gray-800 dark:lg:hover:bg-gray-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Button>
                            </MotionDiv>
                        </MotionDiv>
                    </div>
                </MotionDiv>
            )}

            {/* Hero Section */}
            <MotionSection 
                className="px-6 py-20 text-center max-w-6xl mx-auto relative overflow-hidden"
                style={{ y, opacity }}
            >
                {/* Floating background elements */}
                <MotionDiv 
                    className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-red-500/10 to-blue-500/10 rounded-full blur-xl"
                    animate={{ 
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <MotionDiv 
                    className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
                    animate={{ 
                        y: [20, -20, 20],
                        x: [10, -10, 10],
                        scale: [1.1, 1, 1.1]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <MotionDiv
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="relative z-10"
                >
                    <MotionDiv variants={staggerItem}>
                        <Badge variant="outline" className="mb-6 border-gray-300 dark:border-gray-700">
                            Your Personal Command Center
                        </Badge>
                    </MotionDiv>
                    
                    <MotionH1 
                        variants={staggerItem}
                        className="w-full text-4xl md:text-6xl font-medium tracking-wide mb-6 leading-tight font-heading"
                    >
                        Life OS is your
                        <MotionSpan 
                            className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent"
                            animate={{ 
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ 
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        > operating system</MotionSpan>
                        <br />for a cluttered life
                    </MotionH1>
                    
                    <MotionP 
                        variants={staggerItem}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                    >
                        Built for ambitious students and side-hustlers who juggle classes, internships, and creative projects. 
                        No more app-hopping or sticky notes—just clarity, focus, and forward momentum in one minimal interface.
                    </MotionP>
                    
                    <MotionDiv 
                        variants={staggerItem}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                    >
                        <MotionDiv
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="bg-black dark:bg-white text-white dark:text-black lg:hover:bg-gray-800 dark:lg:hover:bg-gray-200 px-8">
                                Start Your Free Trial
                                <MotionDiv
                                    className="ml-2"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ 
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </MotionDiv>
                            </Button>
                        </MotionDiv>
                        <MotionDiv
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button variant="outline" size="lg" className="border-gray-300 dark:border-gray-700">
                                Watch Demo
                            </Button>
                        </MotionDiv>
                    </MotionDiv>
                    
                    <MotionDiv 
                        variants={staggerItem}
                        className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-500"
                    >
                        <span>Join the growing community of organized achievers</span>
                    </MotionDiv>
                </MotionDiv>
            </MotionSection>

            {/* Problem Section */}
            <MotionSection 
                id="problems"
                className="px-6 py-16 bg-gray-50 dark:bg-gray-950"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <MotionH2 
                        className="text-3xl font-medium tracking-wide mb-6 font-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Stop juggling scattered workflows
                    </MotionH2>
                    <MotionP 
                        className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        You&apos;re ambitious. You&apos;ve got classes, internships, side projects, and big dreams. 
                        But your productivity setup is scattered across apps, notebooks, and sticky notes.
                    </MotionP>
                    <MotionDiv 
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <ProblemCard
                            icon={<Zap className="h-8 w-8 text-red-500" />}
                            title="Context Switching Chaos"
                            description="Google Keep, Trello, paper notebooks—you lose focus jumping between tools"
                            delay={0}
                        />
                        <ProblemCard
                            icon={<Target className="h-8 w-8 text-red-500" />}
                            title="Missed Opportunities"
                            description="Deadlines slip, ideas vanish, and your reputation suffers from disorganization"
                            delay={0.1}
                        />
                        <ProblemCard
                            icon={<Shield className="h-8 w-8 text-red-500" />}
                            title="Overwhelm & Anxiety"
                            description="Mental fatigue from reactive firefighting instead of proactive progress"
                            delay={0.2}
                        />
                    </MotionDiv>
                </div>
            </MotionSection>

            {/* Solution Section */}
            <MotionSection 
                id="features"
                className="px-6 py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-6xl mx-auto">
                    <MotionDiv 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-medium tracking-wide mb-6 font-heading">Everything you need. Nothing you don&apos;t.</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Life OS transforms scattered workflows into a seamless life dashboard. 
                            Cut context-switching by half and gain calm confidence knowing nothing slips through the cracks.
                        </p>
                    </MotionDiv>
                    
                    {/* Feature Cards */}
                    <FeatureCard
                        icon={<Target className="h-6 w-6 text-blue-500" />}
                        title="Unified Task Management"
                        description="Stop juggling separate tools for coursework, internship deliverables, and side-project milestones. Life OS brings everything into one organized system where you can see your full workload at a glance."
                        features={[
                            "Organize tasks by project, course, or priority with custom tags and filters",
                            "Set deadlines and get intelligent reminders before things slip",
                            "Track progress with visual indicators and completion metrics"
                        ]}
                        delay={0}
                    />

                    <FeatureCard
                        icon={<Sparkles className="h-6 w-6 text-green-500" />}
                        title="Intelligent Capture"
                        description="Capture ideas, notes, and tasks instantly without breaking your flow. Whether you're in class, at your internship, or working on your side project, everything gets automatically organized."
                        features={[
                            "Quick capture with smart categorization based on context and keywords",
                            "Rich text formatting for detailed notes and documentation",
                            "Link notes to specific projects or tasks for easy reference"
                        ]}
                        isReversed={true}
                        delay={0.2}
                    />

                    <FeatureCard
                        icon={<Zap className="h-6 w-6 text-purple-500" />}
                        title="Focus Workflows"
                        description="Built specifically for students and side-hustlers. No enterprise bloat, no features you'll never use. Just the essential tools you need to stay organized and productive across all your commitments."
                        features={[
                            "Study mode with distraction-free interface and timer integration",
                            "Project mode for tracking side-hustle milestones and client work",
                            "Career mode for internship tasks and professional development"
                        ]}
                        delay={0.4}
                    />

                    <FeatureCard
                        icon={<Shield className="h-6 w-6 text-yellow-500" />}
                        title="Seamless Sync"
                        description="Your data follows you everywhere. Start a task on your laptop in the library, add notes on your phone during lunch, and check progress on your tablet at home. Everything stays perfectly synchronized."
                        features={[
                            "Real-time sync across all devices with offline support",
                            "Responsive design optimized for mobile, tablet, and desktop",
                            "Progressive web app for native-like experience on any device"
                        ]}
                        isReversed={true}
                        delay={0.6}
                    />

                    <FeatureCard
                        icon={<Users className="h-6 w-6 text-red-500" />}
                        title="Media & Life Tracking"
                        description="Because life isn't just about work. Track movies you want to watch, books you're reading, and experiences you want to have. Balance productivity with personal growth and enjoyment."
                        features={[
                            "Movie and TV show watchlist with ratings and reviews",
                            "Personal goals and habit tracking for holistic life management",
                            "Mood and reflection logging to maintain mental clarity"
                        ]}
                        delay={0.8}
                    />

                    <FeatureCard
                        icon={<CheckCircle className="h-6 w-6 text-indigo-500" />}
                        title="Private & Secure"
                        description="Your ideas, goals, and personal information stay yours. Built with privacy-first principles and enterprise-grade security, so you can focus on creating without worrying about data breaches."
                        features={[
                            "End-to-end encryption for all your sensitive data",
                            "GDPR compliant with full data export and deletion rights",
                            "Regular security audits and transparent privacy practices"
                        ]}
                        isReversed={true}
                        delay={1.0}
                    />
                </div>
            </MotionSection>

            {/* Benefits & Transformation Section */}
            <MotionSection 
                id="benefits"
                className="px-6 py-16 bg-gray-50 dark:bg-gray-950"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-6xl mx-auto">
                    <MotionDiv 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-medium tracking-wide mb-6 font-heading">Transform chaos into clarity</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            See how Life OS shifts you from reactive firefighting to proactive, goal-driven progress.
                        </p>
                    </MotionDiv>
                    
                    <MotionDiv 
                        className="grid md:grid-cols-3 gap-8 mb-16"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <MotionDiv variants={staggerItem} className="text-center">
                            <MotionDiv 
                                className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg mb-6"
                                whileHover={{ scale: 1.02, y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <h4 className="font-medium font-heading text-red-700 dark:text-red-400 mb-3">Before Life OS</h4>
                                <MotionUl 
                                    className="space-y-2 text-sm text-gray-600 dark:text-gray-400"
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    {['📱 App-hopping between tools', '📝 Scattered sticky notes', '😰 Missed deadlines', '🧠 Mental overload', '⏰ Wasted time searching'].map((item, index) => (
                                        <MotionLi key={index} variants={staggerItem}>{item}</MotionLi>
                                    ))}
                                </MotionUl>
                            </MotionDiv>
                        </MotionDiv>
                        
                        <MotionDiv variants={staggerItem} className="text-center">
                            <MotionDiv 
                                className="bg-yellow-50 dark:bg-yellow-900/10 p-6 rounded-lg mb-6"
                                whileHover={{ scale: 1.02, y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <h4 className="font-medium font-heading text-yellow-700 dark:text-yellow-400 mb-3">The Transition</h4>
                                <MotionDiv 
                                    className="text-4xl mb-4"
                                    animate={{ rotate: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    →
                                </MotionDiv>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Simple setup, intuitive interface, and immediate organization of your existing chaos.
                                </p>
                            </MotionDiv>
                        </MotionDiv>
                        
                        <MotionDiv variants={staggerItem} className="text-center">
                            <MotionDiv 
                                className="bg-green-50 dark:bg-green-900/10 p-6 rounded-lg mb-6"
                                whileHover={{ scale: 1.02, y: -5 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <h4 className="font-medium font-heading text-green-700 dark:text-green-400 mb-3">After Life OS</h4>
                                <MotionUl 
                                    className="space-y-2 text-sm text-gray-600 dark:text-gray-400"
                                    variants={staggerContainer}
                                    initial="initial"
                                    whileInView="animate"
                                    viewport={{ once: true }}
                                >
                                    {['✨ Single source of truth', '🎯 Clear daily priorities', '📈 Consistent progress', '😌 Mental clarity', '🚀 Confident execution'].map((item, index) => (
                                        <MotionLi key={index} variants={staggerItem}>{item}</MotionLi>
                                    ))}
                                </MotionUl>
                            </MotionDiv>
                        </MotionDiv>
                    </MotionDiv>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-medium tracking-wide mb-6 font-heading">The Life OS Difference</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium font-heading mb-2">Rational Benefits</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            See every task, note, and deadline in one place. Cut context-switching by 50% 
                                            and never lose track of important commitments again.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span className="text-green-600 dark:text-green-400 text-sm font-medium">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium font-heading mb-2">Emotional Benefits</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Gain calm confidence knowing nothing slips through the cracks. 
                                            Feel in control of your ambitious goals and complex schedule.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-4 mt-1">
                                        <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium font-heading mb-2">Social Benefits</h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Impress peers and mentors when you deliver reliably and stay ahead of deadlines. 
                                            Build a reputation for being organized and dependable.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-xl">
                            <h4 className="font-medium font-heading mb-4 text-center">Weekly Impact</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Time saved per week</span>
                                    <span className="font-medium">8+ hours</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Stress reduction</span>
                                    <span className="font-medium">Significant</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Deadline compliance</span>
                                    <span className="font-medium">95%+</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Mental clarity</span>
                                    <span className="font-medium">High</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionSection>

            {/* Pricing Section */}
            <MotionSection 
                id="pricing"
                className="px-6 py-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <MotionH2 
                        className="text-3xl font-medium tracking-wide mb-6 font-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Choose your operating system
                    </MotionH2>
                    <MotionP 
                        className="text-lg text-gray-600 dark:text-gray-400 mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Start free, upgrade when you&apos;re ready to unlock your full potential
                    </MotionP>
                    
                    <MotionDiv 
                        className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {/* Free Plan */}
                        <MotionDiv variants={staggerItem}>
                            <MotionDiv
                                whileHover={{ scale: 1.03, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="border-gray-200 dark:border-gray-800 relative h-full">
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl font-heading">Free</CardTitle>
                                        <div className="mt-4">
                                            <MotionSpan 
                                                className="text-4xl font-bold"
                                                initial={{ scale: 0.8 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                                                viewport={{ once: true }}
                                            >
                                                €0
                                            </MotionSpan>
                                            <span className="text-gray-600 dark:text-gray-400">/forever</span>
                                        </div>
                                        <CardDescription className="mt-2">
                                            Start organizing your life today
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            'Up to 50 tasks',
                                            'Basic note-taking', 
                                            '5 projects maximum',
                                            'Movie tracking (10 items)',
                                            'Mobile & web sync'
                                        ].map((feature, index) => (
                                            <MotionDiv 
                                                key={index}
                                                className="flex items-center space-x-3 text-left"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>{feature}</span>
                                            </MotionDiv>
                                        ))}
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.0 }}
                                            viewport={{ once: true }}
                                        >
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button variant="outline" className="w-full mt-6 border-gray-300 dark:border-gray-700">
                                                    Start Free
                                                </Button>
                                            </MotionDiv>
                                        </MotionDiv>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        </MotionDiv>
                        
                        {/* Basic Plan */}
                        <MotionDiv variants={staggerItem}>
                            <MotionDiv
                                whileHover={{ scale: 1.03, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="border-blue-500 dark:border-blue-400 relative h-full">
                                    <MotionDiv
                                        className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                                        initial={{ opacity: 0, y: -10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        viewport={{ once: true }}
                                    >
                                        <Badge className="bg-blue-500 text-white">
                                            Most Popular
                                        </Badge>
                                    </MotionDiv>
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl font-heading">Basic</CardTitle>
                                        <div className="mt-4">
                                            <MotionSpan 
                                                className="text-4xl font-bold"
                                                initial={{ scale: 0.8 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                                                viewport={{ once: true }}
                                            >
                                                €20
                                            </MotionSpan>
                                            <span className="text-gray-600 dark:text-gray-400">/month</span>
                                        </div>
                                        <CardDescription className="mt-2">
                                            Everything you need to organize your life
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            'Unlimited tasks & projects',
                                            'Unlimited notes & ideas', 
                                            'Movie & media tracking',
                                            'All sync features'
                                        ].map((feature, index) => (
                                            <MotionDiv 
                                                key={index}
                                                className="flex items-center space-x-3 text-left"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>{feature}</span>
                                            </MotionDiv>
                                        ))}
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.0 }}
                                            viewport={{ once: true }}
                                        >
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button className="w-full mt-6 dark:text-black bg-blue-500 text-white lg:hover:bg-blue-600">
                                                    Start Free Trial
                                                </Button>
                                            </MotionDiv>
                                        </MotionDiv>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        </MotionDiv>
                        
                        {/* Pro Plan */}
                        <MotionDiv variants={staggerItem}>
                            <MotionDiv
                                whileHover={{ scale: 1.03, y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <Card className="border-gray-200 dark:border-gray-800 relative h-full">
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-2xl font-heading">Pro</CardTitle>
                                        <div className="mt-4">
                                            <MotionSpan 
                                                className="text-4xl font-bold"
                                                initial={{ scale: 0.8 }}
                                                whileInView={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                                                viewport={{ once: true }}
                                            >
                                                €250
                                            </MotionSpan>
                                            <span className="text-gray-600 dark:text-gray-400">/month</span>
                                        </div>
                                        <CardDescription className="mt-2">
                                            For serious achievers building their future
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {[
                                            'Everything in Basic',
                                            'Exclusive community access',
                                            'Beta features first',
                                            'Priority support',
                                            'Monthly strategy calls'
                                        ].map((feature, index) => (
                                            <MotionDiv 
                                                key={index}
                                                className="flex items-center space-x-3 text-left"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                                viewport={{ once: true }}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <span>{feature}</span>
                                            </MotionDiv>
                                        ))}
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 1.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <MotionDiv
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Button className="w-full mt-6 text-white bg-black dark:bg-white dark:text-black border-gray-300 dark:border-gray-700">
                                                    Upgrade to Pro
                                                </Button>
                                            </MotionDiv>
                                        </MotionDiv>
                                    </CardContent>
                                </Card>
                            </MotionDiv>
                        </MotionDiv>
                    </MotionDiv>
                    
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
                        14-day free trial. No credit card required. Cancel anytime.
                    </p>
                </div>
            </MotionSection>

            {/* CTA Section */}
            <MotionSection 
                className="px-6 py-20 bg-black dark:bg-white text-white dark:text-black"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="max-w-4xl mx-auto text-center">
                    <MotionH2 
                        className="text-3xl md:text-4xl font-medium tracking-wide mb-6 font-heading"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Make space for what matters
                    </MotionH2>
                    <MotionP 
                        className="text-lg opacity-90 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Join ambitious students who&apos;ve transformed chaos into clarity. 
                        Your future self will thank you.
                    </MotionP>
                    <MotionDiv
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <MotionDiv
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="bg-white dark:bg-black text-black dark:text-white lg:hover:bg-gray-100 dark:lg:hover:bg-gray-900 px-8">
                                Start Your Free Trial
                                <MotionDiv
                                    className="ml-2"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ 
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <ArrowRight className="h-4 w-4" />
                                </MotionDiv>
                            </Button>
                        </MotionDiv>
                    </MotionDiv>
                </div>
            </MotionSection>

            {/* Footer */}
            <MotionFooter 
                className="px-6 py-8 border-t border-gray-200 dark:border-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <MotionDiv 
                    className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                >
                    <MotionDiv 
                        className="flex items-center space-x-2 mb-4 md:mb-0"
                        variants={staggerItem}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <MotionDiv 
                            className="w-6 h-6 bg-black dark:bg-white rounded-sm"
                            whileHover={{ rotate: 5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        />
                        <span className="font-medium tracking-wide font-heading">Life OS</span>
                    </MotionDiv>
                    <MotionDiv 
                        className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {['Privacy', 'Terms', 'Contact'].map((link) => (
                            <MotionDiv
                                key={link}
                                variants={staggerItem}
                            >
                                <MotionDiv
                                    whileHover={{ y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <Link href={`/${link.toLowerCase()}`} className="lg:hover:underline">
                                        {link}
                                    </Link>
                                </MotionDiv>
                            </MotionDiv>
                        ))}
                    </MotionDiv>
                </MotionDiv>
            </MotionFooter>
        </div>
    )
}

// Reusable animated components
function ProblemCard({ icon, title, description, delay }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    delay: number; 
}) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-50px" })

    return (
        <MotionDiv 
            ref={ref}
            className="text-center"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                    duration: 0.6, 
                    delay: delay,
                    ease: "easeOut"
                }
            } : {}}
            whileHover={{ 
                y: -5,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
        >
            <MotionDiv 
                className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                }}
            >
                {icon}
            </MotionDiv>
            <h3 className="font-semibold mb-2 font-heading">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
            </p>
        </MotionDiv>
    )
}

function FeatureCard({ 
    icon, 
    title, 
    description, 
    features, 
    isReversed = false,
    delay = 0 
}: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    features: string[];
    isReversed?: boolean;
    delay?: number;
}) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-100px" })

    return (
        <MotionDiv 
            ref={ref}
            className="mb-20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay }}
        >
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
                <MotionDiv 
                    className={isReversed ? 'lg:order-2' : ''}
                    initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: delay + 0.2 }}
                >
                    <div className="flex items-center mb-6">
                        <MotionDiv 
                            className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4"
                            whileHover={{ 
                                scale: 1.1,
                                rotate: 5,
                                transition: { type: "spring", stiffness: 400, damping: 17 }
                            }}
                        >
                            {icon}
                        </MotionDiv>
                        <h3 className="text-2xl font-medium font-heading">{title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {description}
                    </p>
                    <MotionUl 
                        className="space-y-3 text-gray-600 dark:text-gray-400"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: delay + 0.4
                                }
                            }
                        }}
                        initial="hidden"
                        animate={isInView ? "show" : "hidden"}
                    >
                        {features.map((feature, index) => (
                            <MotionLi 
                                key={index}
                                className="flex items-start"
                                variants={{
                                    hidden: { opacity: 0, x: -20 },
                                    show: { 
                                        opacity: 1, 
                                        x: 0,
                                        transition: { duration: 0.5 }
                                    }
                                }}
                            >
                                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                            </MotionLi>
                        ))}
                    </MotionUl>
                </MotionDiv>
                <MotionDiv 
                    className={`bg-gray-100 dark:bg-gray-900 rounded-lg p-8 min-h-[300px] flex items-center justify-center ${isReversed ? 'lg:order-1' : ''}`}
                    initial={{ opacity: 0, x: isReversed ? -50 : 50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: delay + 0.4 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <MotionDiv
                            animate={{ 
                                y: [-5, 5, -5],
                                rotate: [-2, 2, -2]
                            }}
                            transition={{ 
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {icon}
                        </MotionDiv>
                        <p className="mt-4">{title} Interface</p>
                    </div>
                </MotionDiv>
            </div>
        </MotionDiv>
    )
}
