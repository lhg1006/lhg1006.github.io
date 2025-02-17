// 언어 관리
let currentLang = 'ko';
let translations = {};

const initI18n = async () => {
    try {
        // 번역 파일 로드
        const [koResponse, enResponse] = await Promise.all([
            fetch('js/i18n/ko.json'),
            fetch('js/i18n/en.json')
        ]);
        
        if (!koResponse.ok || !enResponse.ok) {
            throw new Error('Failed to load translation files');
        }

        translations = {
            ko: await koResponse.json(),
            en: await enResponse.json()
        };

        // 저장된 언어 설정 확인
        const savedLang = localStorage.getItem('language');
        if (savedLang && ['ko', 'en'].includes(savedLang)) {
            currentLang = savedLang;
            document.documentElement.lang = currentLang;
            updateLanguage(currentLang);
        }

        // 언어 변경 이벤트 리스너
        const langToggle = document.querySelector('.language-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const currentSection = fullpage_api.getActiveSection().index;
                currentLang = currentLang === 'ko' ? 'en' : 'ko';
                document.documentElement.lang = currentLang;
                updateLanguage(currentLang);
                localStorage.setItem('language', currentLang);

                // fullPage.js 네비게이션 툴팁 업데이트
                const tooltips = [
                    translations[currentLang].nav.about,
                    translations[currentLang].nav.experience,
                    translations[currentLang].nav.projects,
                    translations[currentLang].nav.skills,    
                ];
                
                if (fullpage_api) {
                    fullpage_api.destroy('all');
                    initFullPage(tooltips);
                    // 이전 섹션으로 이동
                    fullpage_api.silentMoveTo(currentSection + 1);
                }
            });
        }
    } catch (error) {
        console.error('Failed to initialize translations:', error);
    }
};

const updateLanguage = (lang) => {
    try {
        // 현재 언어 표시 업데이트
        const langDisplay = document.querySelector('.current-lang');
        if (langDisplay) {
            langDisplay.textContent = lang.toUpperCase();
        }
        
        // 모든 번역 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations[lang], key);
            if (translation) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // ARIA 레이블 업데이트
        document.querySelectorAll('[aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            if (key) {
                const translation = getNestedTranslation(translations[lang], key);
                if (translation) {
                    element.setAttribute('aria-label', translation);
                }
            }
        });
    } catch (error) {
        console.error('Error updating language:', error);
    }
};

const getNestedTranslation = (obj, path) => {
    try {
        return path.split('.').reduce((prev, curr) => {
            return prev ? prev[curr] : null;
        }, obj);
    } catch (error) {
        console.error('Error getting translation:', error);
        return null;
    }
};

// fullPage 설정
const initFullPage = (tooltips = ['소개', '경력', '프로젝트', '기술']) => {
    // 모바일 환경 체크
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        new fullpage('#fullpage', {
            autoScrolling: true,
            scrollHorizontally: true,
            navigation: true,
            navigationPosition: 'right',
            navigationTooltips: tooltips,
            showActiveTooltip: true,
            slidesNavigation: true,
            controlArrows: true,
            scrollingSpeed: 700,
            offsetSections: true,
            fitToSection: true,
            fitToSectionDelay: 600,
            scrollOverflow: true,
            touchSensitivity: 15,
            normalScrollElements: '.experience-card',
            scrollOverflowReset: false,
            bigSectionsDestination: 'top',
            scrollOverflowOptions: {
                scrollbars: true,
                mouseWheel: true,
                hideScrollbars: false,
                fadeScrollbars: false,
                disableMouse: false,
                interactiveScrollbars: true
            },
            afterRender: function() {
                // 프로젝트 컨테이너의 스크롤 방지
                const projectsContainer = document.querySelector('.projects-container');
                if (projectsContainer) {
                    projectsContainer.style.overflowX = 'hidden';
                }
            },
      
        });
    } else {
        // 모바일 설정
        document.querySelector('#fullpage').style.overflow = 'auto';
        document.querySelectorAll('.section').forEach(section => {
            section.style.height = 'auto';
            section.style.minHeight = '100vh';
            section.style.paddingTop = '80px';
            section.style.paddingBottom = '60px';
        });
    }
};

// 섹션 전환 처리
const handleSectionLeave = (origin, destination, direction) => {
    if (window.innerWidth <= 768) {
        const headerHeight = document.querySelector('header').offsetHeight;
        destination.item.style.paddingTop = `${headerHeight}px`;
        
        if (destination.index !== 0) {
            destination.item.style.paddingTop = `${headerHeight + 20}px`;
        }
    } else {
        destination.item.style.paddingTop = '0';
    }
};

// 섹션 로드 처리
const handleSectionLoad = (origin, destination, direction) => {
    if (window.innerWidth <= 768) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const content = destination.item.querySelector('.section-content');
        if (content) {
            // content.style.marginTop = `${headerHeight}px`;
        }
    }
};

// 섹션 오프셋 조정
const adjustSectionOffset = () => {
    const isMobile = window.innerWidth <= 768;
    const headerHeight = document.querySelector('header').offsetHeight;
    
    document.querySelectorAll('.section').forEach((section, index) => {
        if (isMobile) {
            const padding = index === 0 ? headerHeight : headerHeight + 20;
            section.style.paddingTop = `${padding}px`;
            
            const content = section.querySelector('.section-content');
            if (content) {
                // content.style.marginTop = `${headerHeight}px`;
            }
        } else {
            section.style.paddingTop = '0';
            const content = section.querySelector('.section-content');
            if (content) {
                content.style.marginTop = '0';
            }
        }
    });
};

// 경력 슬라이더 초기화
const initExperienceSlider = () => {
    const slider = document.querySelector('.experience-cards');
    const prevBtn = document.querySelector('.experience-slider .nav-button.prev');
    const nextBtn = document.querySelector('.experience-slider .nav-button.next');
    const cards = document.querySelectorAll('.experience-card');
    let currentIndex = 0;

    if (!slider || !prevBtn || !nextBtn) return;

    function updateButtonState() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
    }

    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateButtonState();
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSliderPosition();
        }
    });

    // 초기 버튼 상태 설정
    updateButtonState();
};

// 리사이즈 이벤트 처리 (디바운스)
const handleResize = () => {
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // 화면 크기가 변경될 때 페이지 새로고침
            location.reload();
        }, 250);
    });
};

// 테마 관리
const initTheme = () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 저장된 테마 또는 시스템 설정에 따른 초기 테마 설정
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // 테마 토글 이벤트
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 시스템 테마 변경 감지
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
};

// 스킬 프로그레스 바 초기화
function initializeSkillBars() {
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    const animateProgressBar = (bar) => {
        const level = bar.dataset.level;
        bar.style.width = `${level}%`;
    };

    // Intersection Observer를 사용하여 화면에 보일 때 애니메이션 시작
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
                observer.unobserve(entry.target); // 한 번만 애니메이션 실행
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// 로딩 처리
const handleLoading = () => {
    const loader = document.querySelector('.loader-container');
    
    // 모든 이미지 로딩 완료 대기
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve); // 에러 시에도 진행
        });
    });

    // 이미지 및 폰트 로딩 완료 후 로더 제거
    Promise.all([
        ...imagePromises,
        document.fonts.ready // 웹폰트 로딩 대기
    ]).then(() => {
        loader.classList.add('loader-hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    });
};

// 키보드 네비게이션 처리
const handleKeyboardNavigation = () => {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            let targetLink;
            
            switch(e.key) {
                case 'ArrowRight':
                    targetLink = navLinks[index + 1] || navLinks[0];
                    break;
                case 'ArrowLeft':
                    targetLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    break;
            }
            
            if (targetLink) {
                e.preventDefault();
                targetLink.focus();
            }
        });
    });
};

// 이미지 지연 로딩
const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// 성능 최적화: 디바운스 함수
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 스크롤 이벤트 최적화
const handleOptimizedScroll = debounce(() => {
    // 스크롤 관련 처리
}, 150);

// 프로젝트 슬라이더 기능
document.addEventListener('DOMContentLoaded', function() {
    const projectsContainer = document.querySelector('.projects-container');
    if (!projectsContainer) return;

    // 슬라이더 래퍼 생성 및 초기화
    const projectsSlider = document.createElement('div');
    projectsSlider.className = 'projects-slider';
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        projectsSlider.appendChild(card.cloneNode(true));
    });
    projectsContainer.innerHTML = '';
    projectsContainer.appendChild(projectsSlider);

    const scrollDots = document.querySelectorAll('.scroll-dot');
    const prevButton = document.querySelector('#projects .project-navigation .nav-button.prev');
    const nextButton = document.querySelector('#projects .project-navigation .nav-button.next');
    const isMobile = window.innerWidth <= 768;

    if (!prevButton || !nextButton) return;

    let currentIndex = 0;
    let isAnimating = false;
    const cardsPerView = isMobile ? 1 : 3; // 데스크톱에서 3개 보이도록 수정
    const totalSlides = Math.ceil(projectCards.length / cardsPerView);

    // 슬라이더 이동
    function moveSlider(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // 인덱스 범위 제한
        currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
        const slideWidth = projectsContainer.offsetWidth;
        const translateX = -currentIndex * slideWidth;
        
        requestAnimationFrame(() => {
            projectsSlider.style.transform = `translateX(${translateX}px)`;
        });
        
        updateButtonState();
        updateScrollDots();
        
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // 버튼 상태 업데이트
    function updateButtonState() {
        prevButton.disabled = currentIndex <= 0;
        nextButton.disabled = currentIndex >= totalSlides - 1;
        
        prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
    }

    // 네비게이션 버튼 이벤트
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0 && !isAnimating) {
            moveSlider(currentIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1 && !isAnimating) {
            moveSlider(currentIndex + 1);
        }
    });

    // 스크롤 도트 업데이트
    function updateScrollDots() {
        scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // 터치 이벤트 처리
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startTranslateX = 0;

    projectsSlider.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        isDragging = true;
        touchStartX = e.touches[0].clientX;
        startTranslateX = -currentIndex * projectsContainer.offsetWidth;
        projectsSlider.style.transition = 'none';
    }, { passive: true });

    projectsSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchEndX = e.touches[0].clientX;
        const diff = touchEndX - touchStartX;
        const newTranslateX = startTranslateX + diff;
        
        // 슬라이드 범위 제한
        if (newTranslateX > 0 || newTranslateX < -(totalSlides - 1) * projectsContainer.offsetWidth) {
            return;
        }
        
        requestAnimationFrame(() => {
            projectsSlider.style.transform = `translateX(${newTranslateX}px)`;
        });
    }, { passive: true });

    projectsSlider.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        projectsSlider.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        const touchDiff = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (Math.abs(touchDiff) > minSwipeDistance) {
            if (touchDiff > 0 && currentIndex < totalSlides - 1) {
                moveSlider(currentIndex + 1);
            } else if (touchDiff < 0 && currentIndex > 0) {
                moveSlider(currentIndex - 1);
            } else {
                moveSlider(currentIndex);
            }
        } else {
            moveSlider(currentIndex);
        }
    });

    // 초기 설정
    updateButtonState();
    updateScrollDots();

    // 리사이즈 이벤트 처리
    window.addEventListener('resize', debounce(() => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            location.reload();
        } else {
            moveSlider(currentIndex);
        }
    }, 250));
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initFullPage();
    initExperienceSlider();
    adjustSectionOffset();
    handleResize();
    initializeSkillBars();
    handleLoading();
    handleKeyboardNavigation();
    initLazyLoading();
    initI18n();
    
    window.addEventListener('scroll', handleOptimizedScroll, { passive: true });
}); 