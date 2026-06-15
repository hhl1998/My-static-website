/**
 * 肖邦主题网站 - 交互脚本
 * 功能：导航、滚动动画、时间线动画、名言轮播、音乐模态框、钢琴键交互、粒子系统
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== DOM 引用 ====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const heroParticles = document.getElementById('heroParticles');
    const pianoKeys = document.getElementById('pianoKeys');
    const revealElements = document.querySelectorAll('.reveal');
    const quotesSlider = document.getElementById('quotesSlider');
    const quotesDots = document.getElementById('quotesDots');
    const musicModal = document.getElementById('musicModal');
    const modalClose = document.getElementById('modalClose');
    const playerTitle = document.getElementById('playerTitle');
    const playerPlay = document.getElementById('playerPlay');
    const progressFill = document.getElementById('progressFill');
    const progressTime = document.getElementById('progressTime');
    const workListenBtns = document.querySelectorAll('.work-listen');
    const statNums = document.querySelectorAll('.stat-num[data-count]');

    // ==================== 导航栏滚动效果 ====================
    function updateNavbar() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 更新当前区块的导航高亮
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ==================== 移动端菜单 ====================
    function toggleMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ==================== 粒子系统 ====================
    if (heroParticles) {
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            const size = Math.random() * 4 + 1.5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            heroParticles.appendChild(particle);

            // 动画结束后移除并重新创建
            particle.addEventListener('animationend', () => {
                particle.remove();
                createParticle();
            });
        }

        // 初始创建粒子
        for (let i = 0; i < 30; i++) {
            setTimeout(() => createParticle(), Math.random() * 3000);
        }
    }

    // ==================== 钢琴键交互 ====================
    if (pianoKeys) {
        const keys = pianoKeys.querySelectorAll('.key');

        // 随机点亮琴键
        function randomKeyPress() {
            const whiteKeys = pianoKeys.querySelectorAll('.key.white');
            const randomKey = whiteKeys[Math.floor(Math.random() * whiteKeys.length)];
            randomKey.classList.add('active');
            setTimeout(() => randomKey.classList.remove('active'), 400 + Math.random() * 600);
        }

        // 周期性地触发随机按键
        let keyInterval;
        function startKeyAnimation() {
            keyInterval = setInterval(() => {
                if (Math.random() > 0.4) randomKeyPress();
            }, 800);
        }

        startKeyAnimation();

        // 鼠标悬停时额外触发
        keys.forEach(key => {
            key.addEventListener('mouseenter', () => {
                key.classList.add('active');
                setTimeout(() => key.classList.remove('active'), 300);
            });
        });

        // 页面不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(keyInterval);
            } else {
                startKeyAnimation();
            }
        });
    }

    // ==================== 滚动显示动画 ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 为多个同时出现的元素添加交错延迟
                const siblings = Array.from(entry.target.parentElement?.children || [])
                    .filter(el => el.classList.contains('reveal'));
                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ==================== 时间线动画 ====================
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    timelineItems.forEach(item => timelineObserver.observe(item));

    // ==================== 数字递增动画 ====================
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(eased * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(num => statsObserver.observe(num));

    // ==================== 名言轮播 ====================
    if (quotesSlider && quotesDots) {
        const quoteCards = quotesSlider.querySelectorAll('.quote-card');
        let currentQuote = 0;
        let quoteInterval;

        // 创建指示点
        quoteCards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => showQuote(i));
            quotesDots.appendChild(dot);
        });

        const dots = quotesDots.querySelectorAll('.dot');

        function showQuote(index) {
            quoteCards.forEach(c => c.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            quoteCards[index].classList.add('active');
            dots[index].classList.add('active');
            currentQuote = index;
        }

        function nextQuote() {
            const next = (currentQuote + 1) % quoteCards.length;
            showQuote(next);
        }

        function startQuoteAutoPlay() {
            quoteInterval = setInterval(nextQuote, 5000);
        }

        startQuoteAutoPlay();

        // 鼠标悬停时暂停
        quotesSlider.addEventListener('mouseenter', () => clearInterval(quoteInterval));
        quotesSlider.addEventListener('mouseleave', startQuoteAutoPlay);

        // 页面不可见时暂停
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(quoteInterval);
            } else {
                startQuoteAutoPlay();
            }
        });
    }

    // ==================== 音乐播放器模态框 ====================
    let playerState = {
        isPlaying: false,
        currentWork: null,
        timer: null,
        progress: 0,
        duration: 30 // 模拟30秒
    };

    // 模拟音频数据 - 每个作品对应一个简短的模拟
    const workNames = {
        'nocturne-op9-no2': '降E大调夜曲 Op.9 No.2',
        'etude-op10-no3': 'E大调练习曲 Op.10 No.3 "离别"',
        'polonaise-op53': '降A大调波罗乃兹 Op.53 "英雄"',
        'ballade-no1': 'G小调第一叙事曲 Op.23',
        'waltz-op64-no1': '降D大调圆舞曲 Op.64 No.1 "小狗"',
        'prelude-op28-no15': '降D大调前奏曲 Op.28 No.15 "雨滴"'
    };

    function openMusicModal(workId) {
        playerState.currentWork = workId;
        playerState.progress = 0;
        playerState.isPlaying = false;
        progressFill.style.width = '0%';
        progressTime.textContent = '0:00 / 0:30';
        playerPlay.textContent = '▶ 播放';
        playerTitle.textContent = workNames[workId] || '肖邦作品';

        if (playerState.timer) {
            clearInterval(playerState.timer);
            playerState.timer = null;
        }

        musicModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMusicModal() {
        if (playerState.timer) {
            clearInterval(playerState.timer);
            playerState.timer = null;
        }
        playerState.isPlaying = false;
        musicModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function togglePlay() {
        if (playerState.isPlaying) {
            pausePlayback();
        } else {
            startPlayback();
        }
    }

    function startPlayback() {
        playerState.isPlaying = true;
        playerPlay.textContent = '⏸ 暂停';

        playerState.timer = setInterval(() => {
            playerState.progress += 0.1;
            if (playerState.progress >= playerState.duration) {
                playerState.progress = playerState.duration;
                pausePlayback();
                playerState.progress = 0;
                progressFill.style.width = '0%';
                progressTime.textContent = '0:00 / 0:30';
                playerPlay.textContent = '▶ 重播';
                return;
            }
            const pct = (playerState.progress / playerState.duration) * 100;
            progressFill.style.width = pct + '%';
            const current = Math.floor(playerState.progress);
            const secs = current % 60;
            const mins = Math.floor(current / 60);
            progressTime.textContent = `${mins}:${secs.toString().padStart(2, '0')} / 0:30`;
        }, 100);
    }

    function pausePlayback() {
        playerState.isPlaying = false;
        playerPlay.textContent = '▶ 播放';
        if (playerState.timer) {
            clearInterval(playerState.timer);
            playerState.timer = null;
        }
    }

    // 作品试听按钮
    workListenBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const workId = btn.getAttribute('data-audio');
            openMusicModal(workId);
        });
    });

    // 模态框关闭
    modalClose.addEventListener('click', closeMusicModal);
    musicModal.addEventListener('click', (e) => {
        if (e.target === musicModal) closeMusicModal();
    });

    // 播放/暂停
    playerPlay.addEventListener('click', togglePlay);

    // 进度条点击
    const progressBar = document.getElementById('progressBar');
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        playerState.progress = pct * playerState.duration;
        progressFill.style.width = (pct * 100) + '%';
        const current = Math.floor(playerState.progress);
        const secs = current % 60;
        const mins = Math.floor(current / 60);
        progressTime.textContent = `${mins}:${secs.toString().padStart(2, '0')} / 0:30`;
        if (!playerState.isPlaying) {
            startPlayback();
        }
    });

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && musicModal.classList.contains('active')) {
            closeMusicModal();
        }
        if (e.key === ' ' && musicModal.classList.contains('active')) {
            e.preventDefault();
            togglePlay();
        }
    });

    // ==================== 初始状态设置 ====================
    updateNavbar();

    // ==================== 控制台欢迎信息 ====================
    console.log(`
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░  ♫  弗雷德里克·肖邦  ♫            ░░
    ░░  钢琴诗人 · 浪漫主义音乐巨匠       ░░
    ░░  1810 - 1849                      ░░
    ░░                                   ░░
    ░░  "朴素是最终极的成就。"           ░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
      致敬永恒的钢琴诗人
    `);
});
