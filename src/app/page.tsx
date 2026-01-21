'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 3D 배경 lazy loading으로 초기 로딩 성능 개선
const Background3D = lazy(() => import('@/components/Background3D'));

// 배경 타입: 'blob' | 'particles' | 'shapes' | 'wave' | 'stars' | 'lines' | 'matrix' | 'network' | 'cyber' | 'aurora' | 'orbs' | 'fluid' | 'dna' | 'geometric'
const BACKGROUND_TYPE = 'light' as const;

function BackgroundLoading({ isDark }: { isDark?: boolean }) {
  return (
    <div className={`w-full h-full animate-pulse ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`} />
  );
}

function calculateDuration(startDate: string): string {
  const start = new Date(startDate);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  let duration = '';
  if (years > 0) duration += `${years}년 `;
  if (months > 0) duration += `${months}개월`;
  if (years === 0 && months === 0) duration = '1개월 미만';
  return duration;
}

const navItems = [
  { label: 'About', href: '#hero' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
];

const skills = {
  backend: ['Java', 'Spring Boot', 'RESTful API'],
  frontend: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Zustand', 'Recoil', 'React Query'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Vector Search'],
  ai: ['OpenAI API', 'Claude API', 'Prompt Engineering', 'Embedding'],
  devops: ['AWS', 'Vercel', 'Git', 'Ubuntu', 'Apache', 'Shell Script'],
};

const experiences = [
  {
    company: '지피티코리아',
    position: '풀스택 개발자',
    period: '2024.07 - 현재',
    startDate: '2024-07-01',
    isCurrent: true,
    projects: [
      {
        title: '아몬드에듀 백오피스 시스템',
        description: '본사/지점 관리자 포털 및 API 서버 풀스택 개발',
        tech: ['Next.js 15', 'React 19', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'Spring Boot', 'PostgreSQL', 'MongoDB'],
        highlights: [
          '본사/지점 관리자 포털 대다수 페이지 개발, 학생 앱 마무리 및 버그 수정',
          'OpenAI API 연동 AI 총평 자동 생성 시스템 구축',
          'Chart.js 기반 학습 데이터 시각화 (레이더 차트, 막대 그래프)',
          '반응형 웹(모바일~PC) 및 Figma 디자인 시스템 준수',
        ],
      },
      {
        title: 'AIELS 교육 플랫폼',
        description: 'AI 기반 영어 교육 플랫폼 프론트엔드 단독 개발',
        tech: ['Next.js 14', 'TypeScript', 'Zustand', 'React Query', 'Tailwind CSS', 'shadcn/ui'],
        highlights: [
          '문법 시각화 엔진: 구문·절·등위 구조를 동적 괄호, 화살표, 색상 코딩으로 표현',
          'ResizeObserver 기반 좌표 계산 및 모바일 최적화',
          '시험지 PDF 출력: Puppeteer 활용 다중 모드 렌더링',
          'NextAuth.js 기반 JWT 세션 관리 및 역할별 접근 제어',
        ],
      },
      {
        title: '시험 문제 관리 시스템',
        description: 'AI 기반 시험 문제 생성·관리 플랫폼 프론트엔드 단독 개발',
        tech: ['Next.js', 'TypeScript', 'Recoil', 'React Query', 'React Hook Form', 'Axios Interceptor'],
        highlights: [
          '실시간 텍스트 하이라이트 엔진: DOM 기반 절대 좌표 계산, 중복 방지 로직',
          'HOC 패턴(withAuth, withManagerAuth)과 JWT 토큰 관리로 역할별 접근 제어',
          'AI 문제 생성: 지문 기반 객관식·주관식 문제 자동 생성',
          '스마트 로딩 알고리즘: 진행 구간별 속도 제어(89%, 95% 등)로 UX 향상',
        ],
      },
      {
        title: 'AI 벡터 검색 플랫폼',
        description: 'AI API 통합 & 벡터 검색 기반 웹 서비스 풀스택 개발',
        tech: ['Next.js', 'Spring Boot', 'PostgreSQL', 'OpenAI', 'Anthropic API', 'Shell Script'],
        highlights: [
          'OpenAI·Anthropic API 연동 및 Prompt Engineering 적용',
          'PostgreSQL 벡터 검색 기능을 활용한 유사도 검색 시스템 구현',
          'Ubuntu·Apache 서버 환경 구성, Shell Script 기반 자동 배포 파이프라인',
        ],
      },
    ],
  },
  {
    company: '여보야',
    position: '웹 개발자',
    period: '2022.05 - 2023.12',
    isCurrent: false,
    projects: [
      {
        title: '여보야 매칭 플랫폼',
        description: '매칭·이벤트·구인구직 서비스 유지보수 및 신규 개발',
        tech: ['Java', 'Spring Boot', 'MySQL', 'React', 'TypeScript'],
        highlights: [
          'RESTful API 설계 및 구현을 통한 매칭 서비스 백엔드 시스템 개발',
          '참여형 이벤트 시스템: 좋아요 랭킹, 밸런스 게임, 마일리지 적립/사용 로직',
          '관리자 대시보드 API 및 데이터 분석 페이지 구현',
          '저장 프로시저 기반 데이터 처리 최적화',
        ],
      },
    ],
  },
];

const projects = [
  {
    title: 'AI Code Reviewer',
    description: 'AI 기반 코드 리뷰 자동화 도구. GitHub PR에 대한 코드 분석 및 개선점 제안',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/main/images/project/ai-cr-0.png',
    tags: ['Next.js', 'TypeScript', 'OpenAI API'],
    github: 'https://github.com/lhg1006/ai-code-reviewer',
    site: 'https://ai-code-reviewer-two-eta.vercel.app',
  },
  {
    title: 'Grammar Visualizer',
    description: '영어 문법 구조를 시각적으로 표현하는 도구. 구문, 절, 등위 구조를 색상과 괄호로 표시',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/main/images/project/gv-0.png',
    tags: ['Next.js', 'TypeScript', 'DOM Manipulation'],
    github: 'https://github.com/lhg1006/grammar-visualizer',
    site: 'https://grammar-visualizer.vercel.app',
  },
  {
    title: 'RAG Chatbot',
    description: 'RAG(Retrieval-Augmented Generation) 기반 AI 챗봇. 벡터 검색으로 문서 기반 응답 생성',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/main/images/project/rag-0.png',
    tags: ['Next.js', 'TypeScript', 'OpenAI API', 'Vector DB'],
    github: 'https://github.com/lhg1006/rag-chatbot',
    site: 'https://rag-chatbot-five-alpha.vercel.app',
  },
  {
    title: 'Taskflow',
    description: '칸반보드 스타일 프로젝트 관리 도구. Monorepo 구조로 프론트엔드/백엔드 통합 관리',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/main/images/project/tf-0.png',
    tags: ['Next.js', 'TypeScript', 'Monorepo'],
    github: 'https://github.com/lhg1006/taskflow',
    site: '',
  },
  {
    title: '메유 | 메이플랜드 올인원 도구',
    description: '거래 수수료, 월코 비율, 경험치, 배 시간 시간표를 한 곳에서',
    image: 'https://github.com/lhg1006/portfolio-images/blob/b97137908b2a51a9bba25950a7b40ee8cb694ca0/images/project/mlcc-2.png?raw=true',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/meu-malan-util',
    site: 'https://maple-land-calcu.vercel.app',
  },
  {
    title: '메이플 데이터 뷰어',
    description: 'MapleStory.io API를 활용한 데이터 시각화. 반응형 디자인으로 모바일, 태블릿, 데스크탑 환경에 모두 적합',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/59e12f626e773d61b5225e0d6e40af7f1922016d/images/project/mdv-1.png',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/maple_util',
    site: 'https://maple-data-viewer.vercel.app',
  },
  {
    title: 'BluBank Demo',
    description: '현대적인 핀테크 UI/UX를 구현한 뱅킹 앱 포트폴리오',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/ba0ec4e43c1851e29ccef91cc963bc5c9da6741a/images/project/bbk-1.png',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/BluBank-Portfolio',
    site: 'https://blu-bank-portfolio.vercel.app',
  },
  {
    title: '개인 포트폴리오 웹',
    description: '풀스택 개발자로서의 역량과 경험을 보여주는 반응형 포트폴리오 웹사이트',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/7726310b5883116df60b99587bf7b8a1b606da75/images/project/pfs-0.png',
    tags: ['Next.js', 'TypeScript', 'Spring Boot', 'MySQL'],
    github: 'https://github.com/lhg1006/lhg-portfolio',
    site: '',
  },
  {
    title: 'take-a-picture : TAP',
    description: '모바일 화면 기준으로 만들어진 인스타그램을 모티브로 한 웹 서비스',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/2d28ecc0cfe5317675dcc42ac4f4fa020d17af21/images/project/tap-0.png',
    tags: ['Next.js', 'TypeScript', 'Spring Boot', 'MySQL'],
    github: 'https://github.com/lhg1006/Take-a-picture-TAP_js',
    site: '',
  },
  {
    title: 'MBTI 테스트',
    description: '20개의 질문을 통한 MBTI 성격유형 분석. 모바일 친화적인 반응형 디자인',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/a3ed392a2921be631bc8d94977ee17c8f26fb0d6/images/project/mbti-0.png',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/mbti-test',
    site: 'https://mbti-test-blush.vercel.app',
  },
  {
    title: '타로 운세',
    description: '타로 카드 선택을 통해 운세 결과를 제공하는 웹 애플리케이션',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/e68c1d680a5e0ccbda716b34dec41439bc986949/images/project/tarot-0.png',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/tarot-fortune',
    site: 'https://tarot-fortune.vercel.app',
  },
  {
    title: '로또 번호 생성기',
    description: '무료로 로또 번호를 생성할 수 있는 웹 애플리케이션',
    image: 'https://raw.githubusercontent.com/lhg1006/portfolio-images/a3ed392a2921be631bc8d94977ee17c8f26fb0d6/images/project/ltg-0.png',
    tags: ['Next.js', 'TypeScript'],
    github: 'https://github.com/lhg1006/lotto-number-generator',
    site: 'https://lotto-number-generator-pi.vercel.app',
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 다크모드 초기화 및 localStorage 동기화
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ['hero', 'skills', 'experience', 'projects'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative noise ${isDark ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-strong' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.a
              href="#hero"
              className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
              whileHover={{ scale: 1.05 }}
            >
              LHG
            </motion.a>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-5 py-2.5 text-base font-medium rounded-full transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? isDark ? 'text-white bg-white/10' : 'text-gray-900 bg-black/10'
                      : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-yellow-400' : 'bg-black/5 hover:bg-black/10 text-gray-600'
                }`}
                aria-label="테마 변경"
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              <a
                href="mailto:lhg961006@gmail.com"
                className={`px-5 py-2.5 text-base font-medium transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Fixed 3D Background - Lazy loaded */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<BackgroundLoading isDark={isDark} />}>
          <Background3D type={isDark ? 'particles' : 'light'} className="w-full h-full" />
        </Suspense>
      </div>

      {/* Gradient Overlays */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-black/50 via-transparent to-black/70'
            : 'bg-gradient-to-b from-white/30 via-transparent to-white/50'
        }`} />
      </div>

      {/* Content */}
      <main className="relative z-10">
        {/* Hero */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
          <div className={`max-w-6xl w-full backdrop-blur-sm rounded-3xl p-12 ${
            isDark ? 'bg-black/40' : 'bg-white/60'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* 좌측: 텍스트 */}
              <div className="flex-1 text-center md:text-left">
                <motion.p
                  className={`text-sm tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Fullstack Developer
                </motion.p>

                <motion.h1
                  className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  이효규
                </motion.h1>

                <motion.p
                  className={`text-xl md:text-2xl mb-6 leading-relaxed font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  4년차 풀스택 개발자
                </motion.p>

                <motion.p
                  className={`text-lg mb-5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Spring Boot</span> 기반 API 서버부터{' '}
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Next.js</span> 프론트엔드까지<br />
                  제품 전체를 설계하고 구현합니다.
                </motion.p>

                <motion.p
                  className={`text-base mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  AI API 통합 · PostgreSQL 벡터 검색 · 복잡한 DOM 조작<br />
                  기술적 도전을 즐기며, 0→1 제품 개발 경험이 있습니다.
                </motion.p>

                <motion.div
                  className="flex flex-wrap justify-center md:justify-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <a
                    href="#projects"
                    className={`group px-8 py-3 font-medium rounded-full transition-all ${
                      isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    View Projects
                    <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a
                    href="https://github.com/lhg1006"
                    target="_blank"
                    className={`px-8 py-3 glass rounded-full transition-all ${
                      isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    GitHub
                  </a>
                </motion.div>
              </div>

              {/* 우측: 사진들 */}
              <div className="flex-1 flex flex-col items-center">
                {/* 반려동물 사진들 */}
                <div className="flex justify-center gap-6 mb-6">
                  {[
                    { src: '/images/bbibbi.jpeg', alt: '삐삐', name: '삐삐 🐱' },
                    { src: '/images/seulgi.jpeg', alt: '슬기', name: '슬기 🐱' },
                    { src: '/images/berry.jpeg', alt: '베리', name: '베리 🐱' },
                  ].map((pet, i) => (
                    <motion.div
                      key={pet.alt}
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, scale: 0, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + i * 0.15, type: 'spring', stiffness: 200 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-sm opacity-40" />
                      <img
                        src={pet.src}
                        alt={pet.alt}
                        className="relative w-24 h-24 rounded-full border-2 border-white/30 object-cover"
                        loading="eager"
                      />
                      {/* 툴팁 */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {pet.name}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 프로필 사진 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="relative inline-block">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
                    <img
                      src="/images/profile.jpeg"
                      alt="이효규 프로필 사진"
                      className="relative w-64 h-64 rounded-full border-4 border-white/20 object-cover"
                      loading="eager"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <motion.div
              className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
                isDark ? 'border-gray-600' : 'border-gray-400'
              }`}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`w-1 h-2 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-500'}`} />
            </motion.div>
          </motion.div>
        </section>

        {/* Skills */}
        <section id="skills" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* 좌측: 타이틀 */}
              <motion.div
                className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className={`text-base tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>What I Use</p>
                <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  프론트엔드부터 백엔드, AI까지<br />
                  다양한 기술 스택을 활용합니다.
                </p>
              </motion.div>

              {/* 우측: 스킬 리스트 */}
              <div className="lg:w-2/3 grid md:grid-cols-2 gap-5">
                {[
                  { name: 'Backend', items: skills.backend, icon: '⚙️' },
                  { name: 'Frontend', items: skills.frontend, icon: '🎨' },
                  { name: 'Database', items: skills.database, icon: '💾' },
                  { name: 'AI/ML', items: skills.ai, icon: '🤖' },
                  { name: 'DevOps', items: skills.devops, icon: '☁️', span: true },
                ].map((category, idx) => (
                  <motion.div
                    key={category.name}
                    className={`glass rounded-2xl p-6 glow-hover transition-all ${category.span ? 'md:col-span-2' : ''}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <span
                          key={skill}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                            isDark
                              ? 'text-gray-300 bg-white/5 border-white/10 hover:border-white/20 hover:text-white hover:bg-white/10'
                              : 'text-gray-700 bg-black/5 border-black/10 hover:border-black/20 hover:text-gray-900 hover:bg-black/10'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* 좌측: 타이틀 */}
              <motion.div
                className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className={`text-base tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Career</p>
                <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Experience</h2>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  4년간의 개발 경험을 통해<br />
                  풀스택 역량을 키워왔습니다.
                </p>
              </motion.div>

              {/* 우측: 경력 리스트 */}
              <div className="lg:w-2/3 space-y-10">
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  className="glass rounded-2xl overflow-hidden glow-hover"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className={`p-8 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{exp.company}</h3>
                          {exp.isCurrent && (
                            <span className="px-3 py-1 text-sm font-medium bg-green-500/20 text-green-400 rounded-full">
                              현재
                            </span>
                          )}
                        </div>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{exp.position}</p>
                      </div>
                      <p className={`text-base ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {exp.period}
                        {exp.isCurrent && ` · ${calculateDuration(exp.startDate!)}`}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {exp.projects.map((project, pIdx) => (
                      <div key={pIdx} className={`relative pl-6 border-l-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h4 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h4>
                        <p className={`text-base mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech.map((t) => (
                            <span key={t} className={`px-3 py-1 text-sm rounded-lg border ${
                              isDark ? 'text-gray-400 bg-white/5 border-white/10' : 'text-gray-600 bg-black/5 border-black/10'
                            }`}>
                              {t}
                            </span>
                          ))}
                        </div>
                        <ul className="space-y-2">
                          {project.highlights.map((h, hIdx) => (
                            <li key={hIdx} className={`text-base flex items-start gap-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* 좌측: 타이틀 */}
              <motion.div
                className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className={`text-base tracking-[0.3em] uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Side Projects</p>
                <h2 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Projects</h2>
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  개인 프로젝트를 통해<br />
                  새로운 기술을 탐구합니다.
                </p>
              </motion.div>

              {/* 우측: 프로젝트 리스트 */}
              <div className="lg:w-2/3 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <motion.div
                  key={i}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer glass rounded-xl overflow-hidden glow-hover"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                >
                  <div className={`aspect-video overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <img
                      src={project.image}
                      alt={`${project.title} 프로젝트 스크린샷`}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`text-sm font-semibold mb-1 transition-colors line-clamp-1 ${
                      isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`text-xs mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${
                          isDark ? 'text-gray-400 bg-white/5' : 'text-gray-500 bg-black/5'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`py-16 px-6 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>© 2025 이효규</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Built with Next.js, Three.js & Framer Motion</p>
              </div>
              <div className="flex items-center gap-8">
                <a href="mailto:lhg961006@gmail.com" className={`text-base transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}>
                  Email
                </a>
                <a href="https://github.com/lhg1006" target="_blank" className={`text-base transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/hyo-lee-13b536340" target="_blank" className={`text-base transition-colors ${
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <div className={`absolute inset-0 backdrop-blur-sm ${isDark ? 'bg-black/70' : 'bg-black/50'}`} />
            <motion.div
              className={`relative rounded-2xl p-8 max-w-md w-full shadow-2xl ${
                isDark ? 'bg-gray-900 border border-white/10' : 'bg-white'
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                  isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                ✕
              </button>
              <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedProject.title}</h3>
              <p className={`text-base mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{selectedProject.description}</p>
              <div className="flex gap-3">
                {selectedProject.site ? (
                  <a
                    href={selectedProject.site}
                    target="_blank"
                    className={`flex-1 py-3 font-medium rounded-xl text-center transition-all ${
                      isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Visit Site
                  </a>
                ) : (
                  <span className={`flex-1 py-3 font-medium rounded-xl text-center cursor-not-allowed ${
                    isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                    미배포
                  </span>
                )}
                <a
                  href={selectedProject.github}
                  target="_blank"
                  className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                    isDark ? 'bg-white/10 text-gray-300 hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
