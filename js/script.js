function syncMobileViewportHeight() {
    if (window.innerWidth <= 959) {
        var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        document.documentElement.style.setProperty('--app-height', Math.round(vh) + 'px');
    } else {
        document.documentElement.style.removeProperty('--app-height');
    }
}
syncMobileViewportHeight();

function updateBrowserThemeColor(sectionIndex) {
    // Screens 1 & 3 are black (#000000), Screens 2 & 4 are white (#ffffff)
    var isWhite = (sectionIndex === 2 || sectionIndex === 4);
    var color = isWhite ? '#ffffff' : '#000000';
    var meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute('content', color);
    }
    document.documentElement.style.backgroundColor = color;
    if (document.body) {
        document.body.style.backgroundColor = color;
    }
}

function animateItem(el) {
    if (!el || el.getAttribute('data-animated') === 'true') return;
    el.setAttribute('data-animated', 'true');

    var type = el.getAttribute('data-anim');
    if (type === 'fade') {
        var dur = parseFloat(el.getAttribute('data-dur') || '1.5');
        var delay = parseFloat(el.getAttribute('data-delay') || '0');
        el.style.transition = 'opacity ' + dur + 's cubic-bezier(0.19, 1, 0.22, 1) ' + delay + 's';
        requestAnimationFrame(function() {
            el.style.opacity = '1';
        });
    } else if (type === 'sbs-fade') {
        var durMs = parseInt(el.getAttribute('data-dur-ms') || '2000', 10);
        var delayMs = parseInt(el.getAttribute('data-delay-ms') || '0', 10);
        setTimeout(function() {
            el.style.transition = 'opacity ' + (durMs / 1000) + 's linear';
            el.style.opacity = '1';
        }, delayMs);
    } else if (type === 'sbs-pulse') {
        setTimeout(function() {
            el.style.transition = 'opacity 1.1s linear';
            el.style.opacity = '1';
            setTimeout(function() {
                el.style.transition = 'opacity 1.1s linear';
                el.style.opacity = '0';
            }, 2200);
        }, 1500);
    }
}

function triggerScreenAnimations(sectionIndex) {
    var screenEl = document.getElementById('s' + sectionIndex);
    if (!screenEl) return;
    screenEl.querySelectorAll('.anim-item').forEach(function(el) {
        animateItem(el);
    });
}

$(document).ready(function() {
    syncMobileViewportHeight();
    updateBrowserThemeColor(1);

    var sections = $("#s1, #s2, #s3, #s4");
    sections.wrap("<div class='section'></div>");
    $(".section").wrapAll("<div id='fullpage'></div>");

    var isMobile = window.innerWidth <= 959;

    window.page = $('#fullpage').fullpage({
        css3: true,
        scrollBar: !isMobile,
        autoScrolling: true,
        fitToSection: true,
        keyboardScrolling: true,
        bigSectionsDestination: 'top',
        onLeave: function(index, nextIndex) {
            updateBrowserThemeColor(nextIndex);
            triggerScreenAnimations(nextIndex);
        },
        afterLoad: function(anchorLink, index) {
            updateBrowserThemeColor(index);
            triggerScreenAnimations(index);
        }
    });

    triggerScreenAnimations(1);
});

document.addEventListener('DOMContentLoaded', function() {
    function updatePositions() {
        document.querySelectorAll('[data-vcenter="true"]').forEach(function(el) {
            el.style.marginTop = -(el.offsetHeight / 2) + 'px';
        });
    }
    updatePositions();

    var resizeTimer = null;
    function handleViewportChange() {
        syncMobileViewportHeight();
        updatePositions();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 959 && $.fn.fullpage && typeof $.fn.fullpage.reBuild === 'function') {
                $.fn.fullpage.reBuild();
            }
        }, 60);
    }

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updatePositions);
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                animateItem(entry.target);
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.anim-item').forEach(function(el) {
            observer.observe(el);
        });
    }

    // Protection: Block right-click, drag, copy, and DevTools / View-Source shortcuts
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
    document.addEventListener('copy', function(e) {
        e.preventDefault();
    });
    document.addEventListener('cut', function(e) {
        e.preventDefault();
    });
    document.addEventListener('keydown', function(e) {
        var key = (e.key || '').toLowerCase();
        var code = e.keyCode || e.which;
        var cmdOrCtrl = e.ctrlKey || e.metaKey;

        if (code === 123 || key === 'f12') {
            e.preventDefault();
            return false;
        }
        if (cmdOrCtrl && (key === 's' || key === 'ы' || key === 'u' || key === 'г' || key === 'p' || key === 'з' || key === 'c' || key === 'с')) {
            e.preventDefault();
            return false;
        }
        if ((cmdOrCtrl && e.shiftKey && (key === 'i' || key === 'ш' || key === 'j' || key === 'о' || key === 'c' || key === 'с' || key === 'k' || key === 'л')) ||
            (e.metaKey && e.altKey && (key === 'i' || key === 'ш' || key === 'j' || key === 'о' || key === 'c' || key === 'с' || key === 'u' || key === 'г'))) {
            e.preventDefault();
            return false;
        }
    });
});
