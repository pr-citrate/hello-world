document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent.replace(/[^0-9.]/g, '');
                const isPercentage = stat.textContent.includes('%');
                const isDecimal = stat.textContent.includes('.');
                
                animateValue(stat, 0, parseFloat(finalValue), 2000, isPercentage, isDecimal);
                observer.unobserve(stat);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        observer.observe(stat);
    });

    function animateValue(element, start, end, duration, isPercentage = false, isDecimal = false) {
        const startTime = performance.now();
        
        function updateValue(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;
            
            let displayValue;
            if (isDecimal) {
                displayValue = current.toFixed(1);
            } else {
                displayValue = Math.floor(current).toLocaleString();
            }
            
            if (isPercentage) {
                displayValue += '%';
            }
            
            element.textContent = displayValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    const cards = document.querySelectorAll('.card, .tool-card, .guideline-item');
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });

    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(block => {
        block.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            navigator.clipboard.writeText(this.textContent).then(() => {
                const originalText = this.textContent;
                this.textContent = '✅ 복사되었습니다!';
                this.style.background = '#10b981';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.style.color = '';
                }, 1000);
            }).catch(() => {
                console.log('복사 기능을 사용할 수 없습니다.');
            });
        });

        block.style.cursor = 'pointer';
        block.title = '클릭하여 복사';
    });

    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header.offsetHeight;
            const sectionTop = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    };

    const quoteSection = document.querySelector('.quote-section');
    if (quoteSection) {
        const quoteObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const blockquote = entry.target.querySelector('blockquote');
                    const cite = entry.target.querySelector('cite');
                    
                    blockquote.style.opacity = '0';
                    blockquote.style.transform = 'translateY(30px)';
                    cite.style.opacity = '0';
                    cite.style.transform = 'translateY(20px)';
                    
                    blockquote.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    cite.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    
                    setTimeout(() => {
                        blockquote.style.opacity = '1';
                        blockquote.style.transform = 'translateY(0)';
                    }, 200);
                    
                    setTimeout(() => {
                        cite.style.opacity = '1';
                        cite.style.transform = 'translateY(0)';
                    }, 600);
                    
                    quoteObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        quoteObserver.observe(quoteSection);
    }

    const heroCode = document.querySelector('.python-code');
    if (heroCode) {
        const lines = heroCode.textContent.split('\n');
        heroCode.innerHTML = '';
        
        lines.forEach((line, index) => {
            const lineElement = document.createElement('div');
            lineElement.textContent = line;
            lineElement.style.opacity = '0';
            lineElement.style.transform = 'translateX(-20px)';
            lineElement.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
            heroCode.appendChild(lineElement);
            
            setTimeout(() => {
                lineElement.style.opacity = '1';
                lineElement.style.transform = 'translateX(0)';
            }, 1000 + index * 100);
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    function updateHeaderForDarkMode() {
        if (prefersDarkScheme.matches) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }

    prefersDarkScheme.addEventListener('change', updateHeaderForDarkMode);
    updateHeaderForDarkMode();
});