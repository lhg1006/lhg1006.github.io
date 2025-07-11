// 포트폴리오 메인 JavaScript

// DOM 요소들
const themeToggles = document.querySelectorAll('.theme-toggle');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNavMenu = document.querySelector('.mobile-nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('.section');

// 테마 관리
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 테마 토글 이벤트 (모든 토글 버튼에 적용)
    themeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    });
};

// 모바일 메뉴 관리
const initMobileMenu = () => {
    if (mobileMenuToggle && mobileNavMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = mobileNavMenu.classList.contains('active');
            
            if (isActive) {
                mobileNavMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuToggle.setAttribute('aria-label', '모바일 메뉴 열기');
            } else {
                mobileNavMenu.classList.add('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
                mobileMenuToggle.setAttribute('aria-label', '모바일 메뉴 닫기');
            }
        });

        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        const mobileNavLinks = mobileNavMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavMenu.classList.remove('active');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuToggle.setAttribute('aria-label', '모바일 메뉴 열기');
            });
        });
    }
};

// 부드러운 스크롤 및 네비게이션 활성화
const initSmoothScroll = () => {
    // 모든 내비게이션 링크에 부드러운 스크롤 적용
    const allNavLinks = [...navLinks, ...navDots];
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// 스크롤 시 활성 섹션 감지
const initScrollSpy = () => {
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // 네비게이션 링크 활성화 업데이트
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // 사이드 네비게이션 도트 활성화 업데이트
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === `#${sectionId}`) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
};

// 기술 스택 애니메이션 (아이콘과 배지 빛 효과)
const initSkillsAnimation = () => {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 스킬 카테고리 애니메이션 시작
                if (entry.target.classList.contains('skill-category')) {
                    entry.target.style.animationPlayState = 'running';
                    
                    // 내부 스킬 아이템들에 지연 애니메이션 추가
                    const categorySkills = entry.target.querySelectorAll('.skill-item');
                    categorySkills.forEach((skill, index) => {
                        setTimeout(() => {
                            skill.style.opacity = '1';
                            skill.style.transform = 'translateY(0) scale(1)';
                        }, index * 150);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 모든 스킬 카테고리 관찰
    skillCategories.forEach(category => {
        observer.observe(category);
        
        // 초기 애니메이션 일시정지
        category.style.animationPlayState = 'paused';
        
        // 내부 스킬 아이템들 초기 상태 설정
        const categorySkills = category.querySelectorAll('.skill-item');
        categorySkills.forEach(skill => {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px) scale(0.9)';
            skill.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
};

// 프로젝트 슬라이더
const initProjectSlider = () => {
    const projectsContainer = document.querySelector('.projects-container');
    const prevButton = document.querySelector('.project-navigation .prev');
    const nextButton = document.querySelector('.project-navigation .next');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    
    if (!projectsContainer) return;

    let currentIndex = 0;
    const projectCards = document.querySelectorAll('.project-card');
    const totalProjects = projectCards.length;

    const updateSlider = (index) => {
        const cardWidth = projectCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(projectsContainer).gap) || 24;
        const scrollPosition = index * (cardWidth + gap);
        
        projectsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        // 도트 업데이트
        if (scrollDots.length > 0) {
            scrollDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        currentIndex = index;
    };

    // 버튼 이벤트
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            const newIndex = currentIndex > 0 ? currentIndex - 1 : totalProjects - 1;
            updateSlider(newIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const newIndex = currentIndex < totalProjects - 1 ? currentIndex + 1 : 0;
            updateSlider(newIndex);
        });
    }

    // 도트 클릭 이벤트
    scrollDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlider(index);
        });
    });

    // 스크롤 이벤트로 현재 위치 감지
    let scrollTimeout;
    projectsContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = projectsContainer.scrollLeft;
            const cardWidth = projectCards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(projectsContainer).gap) || 24;
            const index = Math.round(scrollLeft / (cardWidth + gap));
            
            if (scrollDots.length > 0) {
                scrollDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            currentIndex = Math.max(0, Math.min(index, totalProjects - 1));
        }, 100);
    });

    // 초기 도트 설정
    if (scrollDots.length > 0 && scrollDots[0]) {
        scrollDots[0].classList.add('active');
    }
};

// Experience는 이제 슬라이더가 아닌 리스트 형태
const initExperienceSlider = () => {
    // Experience 슬라이더 기능 제거됨 - 리스트 형태로 변경
    return;
};

// 로딩 애니메이션 제거
const hideLoader = () => {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
        }, 1000);
    }
};

// 키보드 네비게이션
const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        // 화살표 키로 섹션 이동
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const currentSection = document.querySelector('.section.active') || document.querySelector('.section');
            if (!currentSection) return;

            const sectionIndex = Array.from(sections).indexOf(currentSection);
            let targetIndex;

            if (e.key === 'ArrowDown') {
                targetIndex = sectionIndex < sections.length - 1 ? sectionIndex + 1 : 0;
            } else {
                targetIndex = sectionIndex > 0 ? sectionIndex - 1 : sections.length - 1;
            }

            sections[targetIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // ESC 키로 모바일 메뉴 닫기
        if (e.key === 'Escape' && mobileNavMenu.classList.contains('active')) {
            mobileNavMenu.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
};

// 초기화 함수
const init = () => {
    hideLoader();
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initSkillsAnimation();
    initProjectSlider();
    initExperienceSlider();
    initKeyboardNavigation();
};

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', init);

// 리사이즈 시 슬라이더 재초기화
window.addEventListener('resize', () => {
    // 디바운싱
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        initProjectSlider();
    }, 250);
});

// 페이지 가시성 변경 시 애니메이션 일시정지/재개
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 페이지가 숨겨졌을 때 애니메이션 일시정지
        document.body.style.animationPlayState = 'paused';
    } else {
        // 페이지가 다시 보일 때 애니메이션 재개
        document.body.style.animationPlayState = 'running';
    }
});