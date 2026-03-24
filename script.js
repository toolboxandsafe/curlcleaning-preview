// Curl Cleaning - JavaScript UX Enhancements
// Created: March 24, 2026

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation Menu
    // ============================================
    function initMobileNav() {
        const header = document.querySelector('header .container');
        const nav = document.querySelector('header nav');
        
        if (!header || !nav) return;

        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        
        // Insert hamburger before the CTA button
        const headerCta = header.querySelector('.header-cta');
        if (headerCta) {
            header.insertBefore(hamburger, headerCta);
        }

        // Toggle menu
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('mobile-open');
            document.body.classList.toggle('nav-open');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('mobile-open');
                document.body.classList.remove('nav-open');
            });
        });
    }

    // ============================================
    // Smooth Scrolling
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Phone Number Auto-Formatting
    // ============================================
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length > 10) {
                    value = value.substring(0, 10);
                }
                
                if (value.length >= 6) {
                    this.value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6);
                } else if (value.length >= 3) {
                    this.value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
                } else {
                    this.value = value;
                }
            });
        });
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', function() {
                    const isOpen = item.classList.contains('open');
                    
                    // Close all other items
                    faqItems.forEach(other => {
                        other.classList.remove('open');
                        const otherAnswer = other.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    });
                    
                    // Toggle current item
                    if (!isOpen) {
                        item.classList.add('open');
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    // ============================================
    // Scroll-to-Top Button
    // ============================================
    function initScrollToTop() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Scroll to top');
        button.innerHTML = '↑';
        document.body.appendChild(button);

        // Show/hide based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });

        button.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // Form Validation Enhancement
    // ============================================
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    if (this.classList.contains('error')) {
                        validateField(this);
                    }
                });
            });

            form.addEventListener('submit', function(e) {
                let hasError = false;
                
                inputs.forEach(input => {
                    if (!validateField(input)) {
                        hasError = true;
                    }
                });

                if (hasError) {
                    e.preventDefault();
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                    }
                }
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Check required
        if (field.required && !value) {
            isValid = false;
        }

        // Check email format
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }

        // Check phone format (optional)
        if (field.type === 'tel' && value) {
            const cleanPhone = value.replace(/\D/g, '');
            if (cleanPhone.length < 10) {
                isValid = false;
            }
        }

        // Update field styling
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
        }

        return isValid;
    }

    // ============================================
    // Lazy Load Images (Intersection Observer)
    // ============================================
    function initLazyLoad() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ============================================
    // Animate on Scroll (Simple)
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .review-card, .stat');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                el.classList.add('animate-ready');
                observer.observe(el);
            });
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initMobileNav();
        initSmoothScroll();
        initPhoneFormatting();
        initFaqAccordion();
        initScrollToTop();
        initFormValidation();
        initLazyLoad();
        initScrollAnimations();
    });

})();
