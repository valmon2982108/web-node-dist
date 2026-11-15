$(document).ready(function() {
    var sections = $("#s1, #s2, #s3, #s4");
    sections.wrap("<div class='section'></div>");
    $(".section").wrapAll("<div id='fullpage'></div>");

    window.page = $('#fullpage').fullpage({
        css3: true,
        scrollBar: true,
        keyboardScrolling: true
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Vertical centering offset (matches Zero Block axisy="center" calculation)
    function updatePositions() {
        document.querySelectorAll('[data-vcenter="true"]').forEach(function(el) {
            el.style.marginTop = -(el.offsetHeight / 2) + 'px';
        });
    }
    updatePositions();
    window.addEventListener('resize', updatePositions);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updatePositions);
    }

    // Trigger animations once when block or element scrolls into view
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            observer.unobserve(el);

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
                // Step 1: wait 1500ms, fade in over 1100ms
                setTimeout(function() {
                    el.style.transition = 'opacity 1.1s linear';
                    el.style.opacity = '1';
                    // Step 2: after 1100ms fade-in + 1100ms hold (2200ms), fade out over 1100ms
                    setTimeout(function() {
                        el.style.transition = 'opacity 1.1s linear';
                        el.style.opacity = '0';
                    }, 2200);
                }, 1500);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.anim-item').forEach(function(el) {
        observer.observe(el);
    });

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

        // F12
        if (code === 123 || key === 'f12') {
            e.preventDefault();
            return false;
        }
        // Ctrl/Cmd + S (Save), U (View Source), P (Print), C (Copy)
        if (cmdOrCtrl && (key === 's' || key === 'ы' || key === 'u' || key === 'г' || key === 'p' || key === 'з' || key === 'c' || key === 'с')) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / J / C / K (Windows/Linux DevTools) or Cmd+Option+I / J / C / U (macOS DevTools)
        if ((cmdOrCtrl && e.shiftKey && (key === 'i' || key === 'ш' || key === 'j' || key === 'о' || key === 'c' || key === 'с' || key === 'k' || key === 'л')) ||
            (e.metaKey && e.altKey && (key === 'i' || key === 'ш' || key === 'j' || key === 'о' || key === 'c' || key === 'с' || key === 'u' || key === 'г'))) {
            e.preventDefault();
            return false;
        }
    });
});
