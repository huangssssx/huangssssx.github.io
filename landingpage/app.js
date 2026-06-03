(function() {
var heroEl = document.getElementById('hero');
var navbar = document.getElementById('navbar');
var scrollTimeout;
function scrollToHashTarget(href) {
if (!href || href === '#' || href.length < 2) return false;
var t = document.querySelector(href);
if (!t) return false;
t.scrollIntoView({ behavior: 'smooth', block: 'start' });
return true;
}
window.addEventListener('scroll', function() {
navbar.classList.toggle('scrolled', window.scrollY > 10);
document.documentElement.classList.add('scrolling');
clearTimeout(scrollTimeout);
scrollTimeout = setTimeout(function() {
document.documentElement.classList.remove('scrolling');
}, 3000);
}, { passive: true });
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
a.addEventListener('click', function(e) {
var href = this.getAttribute('href');
if (this.hasAttribute('data-modal')) return;
if (scrollToHashTarget(href)) e.preventDefault();
});
});
document.querySelectorAll('.faq-item__question').forEach(function(btn) {
btn.addEventListener('click', function() {
var item = btn.parentElement;
var wasActive = item.classList.contains('active');
document.querySelectorAll('.faq-item').forEach(function(fi) { fi.classList.remove('active'); });
if (!wasActive) item.classList.add('active');
});
});
var revealEls = document.querySelectorAll('.reveal, .reveal-scale');
var revealObs = new IntersectionObserver(function(entries) {
entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(function(el) { revealObs.observe(el); });
var typedEl = document.getElementById('hero-typed');
var words = ['10x Faster', 'With No Code', 'Like a Pro', 'In Minutes'];
var wordIdx = 0, charIdx = 0, isDeleting = false, typeSpd = 100;
function typeWriter() {
var w = words[wordIdx];
if (isDeleting) { typedEl.textContent = w.substring(0, charIdx - 1); charIdx--; typeSpd = 50; }
else { typedEl.textContent = w.substring(0, charIdx + 1); charIdx++; typeSpd = 120; }
if (!isDeleting && charIdx === w.length) { typeSpd = 2000; isDeleting = true; }
else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; typeSpd = 400; }
setTimeout(typeWriter, typeSpd);
}
typeWriter();
var staticTitle = document.getElementById('heroTitleStatic');
if (staticTitle) {
var text = staticTitle.textContent;
staticTitle.innerHTML = '';
text.split('').forEach(function(ch, i) {
var span = document.createElement('span');
span.className = 'kinetic-char';
span.style.animationDelay = (0.3 + i * 0.03) + 's';
span.textContent = ch === ' ' ? '\u00A0' : ch;
staticTitle.appendChild(span);
});
}
var statsSection = document.getElementById('stats');
var countersStarted = false;
function animateCounters() {
if (countersStarted) return; countersStarted = true;
document.querySelectorAll('.stat__number[data-target]').forEach(function(el) {
var target = parseFloat(el.getAttribute('data-target'));
var suffix = el.getAttribute('data-suffix') || '';
var isDecimal = el.getAttribute('data-decimal') === 'true';
var duration = 2000, startTime = null;
function update(ts) {
if (!startTime) startTime = ts;
var p = Math.min((ts - startTime) / duration, 1);
var eased = 1 - Math.pow(1 - p, 4);
var current = eased * target;
el.textContent = isDecimal ? current.toFixed(1) + suffix : Math.floor(current).toLocaleString() + suffix;
if (p < 1) requestAnimationFrame(update);
else el.textContent = isDecimal ? target.toFixed(1) + suffix : target.toLocaleString() + suffix;
}
requestAnimationFrame(update);
});
}
var statsObs = new IntersectionObserver(function(entries) {
if (entries[0].isIntersecting) animateCounters();
}, { threshold: 0.3 });
statsObs.observe(statsSection);
var mockup = document.getElementById('heroMockup');
if (mockup && heroEl) {
heroEl.addEventListener('mousemove', function(e) {
var rect = heroEl.getBoundingClientRect();
var x = (e.clientX - rect.left) / rect.width - 0.5;
var y = (e.clientY - rect.top) / rect.height - 0.5;
mockup.style.transform = 'perspective(1200px) rotateX(' + (8 - y * 16) + 'deg) rotateY(' + (x * 16 - 4) + 'deg)';
});
heroEl.addEventListener('mouseleave', function() {
mockup.style.transform = 'perspective(1200px) rotateX(8deg) rotateY(-4deg)';
});
}
var eyeL = document.getElementById('mascotEyeL');
var eyeR = document.getElementById('mascotEyeR');
document.addEventListener('mousemove', function(e) {
if (eyeL && eyeR) {
var dx = (e.clientX / window.innerWidth - 0.5) * 4;
var dy = (e.clientY / window.innerHeight - 0.5) * 4;
eyeL.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
eyeR.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
}
});
var parallaxLayers = document.querySelectorAll('.parallax-layer');
window.addEventListener('scroll', function() {
parallaxLayers.forEach(function(layer) {
var speed = parseFloat(layer.getAttribute('data-speed')) || 0.02;
var rect = layer.getBoundingClientRect();
if (rect.top < window.innerHeight && rect.bottom > 0) {
var y = (rect.top - window.innerHeight / 2) * speed;
layer.style.transform = 'translateY(' + y + 'px)';
}
});
}, { passive: true });
var scrollPath = document.getElementById('scrollPath');
var pathLength = 0;
if (scrollPath) {
window.addEventListener('load', function() {
requestAnimationFrame(function() {
requestAnimationFrame(function() {
pathLength = scrollPath.getTotalLength();
scrollPath.style.strokeDasharray = pathLength;
scrollPath.style.strokeDashoffset = pathLength;
});
});
});
window.addEventListener('scroll', function() {
if (!pathLength) return;
var heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
var progress = Math.min(window.scrollY / heroH, 1);
scrollPath.style.strokeDashoffset = pathLength * (1 - progress);
}, { passive: true });
}
var canvas = document.getElementById('particleCanvas');
if (canvas) {
var ctx = canvas.getContext('2d');
var particles = [];
var mouseX = 0, mouseY = 0;
var canvasVisible = false;
var canvasW = 0, canvasH = 0;
var canvasReady = false;
function resizeCanvas() {
if (!canvasReady) return;
var rect = canvas.parentElement.getBoundingClientRect();
canvasW = rect.width; canvasH = rect.height;
canvas.width = canvasW; canvas.height = canvasH;
}
window.addEventListener('load', function() {
requestAnimationFrame(function() {
requestAnimationFrame(function() {
canvasReady = true;
resizeCanvas();
});
});
});
var resizeTimer;
window.addEventListener('resize', function() {
clearTimeout(resizeTimer);
resizeTimer = setTimeout(resizeCanvas, 100);
});
var particleCount = isMobile ? 15 : 40;
for (var i = 0; i < particleCount; i++) {
particles.push({
x: Math.random() * 800, y: Math.random() * 600,
vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
r: Math.random() * 2 + 1, o: Math.random() * 0.5 + 0.2
});
}
if (heroEl) {
heroEl.addEventListener('mousemove', function(e) {
var rect = canvas.getBoundingClientRect();
mouseX = e.clientX - rect.left; mouseY = e.clientY - rect.top;
});
var canvasObs = new IntersectionObserver(function(entries) {
canvasVisible = entries[0].isIntersecting;
if (canvasVisible && !canvas._rafRunning) { canvas._rafRunning = true; drawParticles(); }
}, { threshold: 0.05 });
canvasObs.observe(canvas);
canvasVisible = true;
}
var connectionDistSq = 120 * 120;
function drawParticles() {
if (!canvasVisible) { canvas._rafRunning = false; return; }
var w = canvasW || canvas.width, h = canvasH || canvas.height;
ctx.clearRect(0, 0, w, h);
var len = particles.length;
for (var i = 0; i < len; i++) {
var p = particles[i];
p.x += p.vx; p.y += p.vy;
if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
var dx = mouseX - p.x, dy = mouseY - p.y;
var dist = dx * dx + dy * dy;
if (dist < 22500) { p.x -= dx * 0.01; p.y -= dy * 0.01; }
ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
ctx.fillStyle = 'rgba(79,70,229,' + p.o + ')'; ctx.fill();
}
ctx.beginPath();
for (var i = 0; i < len; i++) {
for (var j = i + 1; j < len; j++) {
var dx = particles[i].x - particles[j].x;
var dy = particles[i].y - particles[j].y;
var dSq = dx * dx + dy * dy;
if (dSq < connectionDistSq) {
var alpha = 0.1 * (1 - Math.sqrt(dSq) / 120);
ctx.strokeStyle = 'rgba(79,70,229,' + alpha + ')';
ctx.lineWidth = 0.5;
ctx.moveTo(particles[i].x, particles[i].y);
ctx.lineTo(particles[j].x, particles[j].y);
}
}
}
ctx.stroke();
requestAnimationFrame(drawParticles);
}
drawParticles();
}
var gridBtns = document.querySelectorAll('.grid-toggle__btn');
var featuresGrid = document.getElementById('featuresGrid');
gridBtns.forEach(function(btn) {
btn.addEventListener('click', function() {
gridBtns.forEach(function(b) { b.classList.remove('active'); });
btn.classList.add('active');
if (btn.getAttribute('data-view') === 'list') featuresGrid.classList.add('list-view');
else featuresGrid.classList.remove('list-view');
});
});
var pricingToggle = document.getElementById('pricingToggle');
var toggleMonthly = document.getElementById('toggleMonthly');
var toggleYearly = document.getElementById('toggleYearly');
var priceAmounts = document.querySelectorAll('.pricing-card__amount[data-monthly]');
var isYearly = false;
if (pricingToggle) {
pricingToggle.addEventListener('click', function() {
isYearly = !isYearly;
pricingToggle.classList.toggle('yearly', isYearly);
toggleMonthly.classList.toggle('pricing__toggle-label--active', !isYearly);
toggleYearly.classList.toggle('pricing__toggle-label--active', isYearly);
priceAmounts.forEach(function(el) {
el.textContent = isYearly ? el.getAttribute('data-yearly') : el.getAttribute('data-monthly');
});
});
}
var hamburger = document.getElementById('hamburger');
var mobileMenu = document.getElementById('mobileMenu');
var mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
var _mobileScrollY = 0;
function closeMobileMenu() {
hamburger.classList.remove('active');
mobileMenu.classList.remove('open');
document.body.classList.remove('overflow-hidden');
document.body.style.top = '';
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, _mobileScrollY);
document.documentElement.style.scrollBehavior = '';
}
function openMobileMenu() {
_mobileScrollY = window.scrollY;
document.body.style.top = '-' + _mobileScrollY + 'px';
hamburger.classList.add('active');
mobileMenu.classList.add('open');
document.body.classList.add('overflow-hidden');
}
if (hamburger && mobileMenu) {
hamburger.addEventListener('click', function() {
if (mobileMenu.classList.contains('open')) closeMobileMenu();
else openMobileMenu();
});
mobileMenuLinks.forEach(function(link) {
link.addEventListener('click', function(e) {
var href = link.getAttribute('href');
var target = href ? document.querySelector(href) : null;
if (!target) return;
e.preventDefault();
closeMobileMenu();
requestAnimationFrame(function() {
requestAnimationFrame(function() {
target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
});
});
});
document.querySelectorAll('.mobile-menu__cta .btn').forEach(function(btn) {
btn.addEventListener('click', function() { closeMobileMenu(); });
});
}
var isMobile = window.matchMedia('(max-width: 768px)').matches;
var isTablet = window.matchMedia('(max-width: 1024px)').matches;
var footerPages = {
privacy: {
title: 'Privacy Policy',
body: '<h3>1. Information We Collect</h3><p>We collect information you provide directly, such as your name, email, and payment details when you sign up or make a purchase. We also automatically collect usage data, device information, and cookies to improve our service.</p><h3>2. How We Use Your Information</h3><p>We use your information to provide and improve our services, process transactions, send communications, and ensure platform security. We never sell your personal data to third parties.</p><h3>3. Data Storage & Security</h3><p>Your data is stored on secure servers with industry-standard encryption (AES-256 at rest, TLS 1.3 in transit). We conduct regular security audits and maintain SOC 2 Type II compliance.</p><h3>4. Your Rights</h3><p>You have the right to access, correct, delete, or export your personal data at any time. You can manage your preferences in your account settings or contact our privacy team.</p><h3>5. Contact</h3><p>For privacy-related questions, contact us at privacy@webcraftpro.com.</p>'
},
terms: {
title: 'Terms of Service',
body: '<h3>1. Acceptance of Terms</h3><p>By accessing or using WebCraft Pro, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p><h3>2. Account Responsibilities</h3><p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must be at least 16 years old to create an account.</p><h3>3. Acceptable Use</h3><p>You agree not to use our platform for illegal activities, to distribute malware, or to infringe on intellectual property rights. We reserve the right to suspend accounts that violate these terms.</p><h3>4. Intellectual Property</h3><p>Content you create with WebCraft Pro belongs to you. We do not claim ownership of your work. Our platform, templates, and brand assets remain our intellectual property.</p><h3>5. Limitation of Liability</h3><p>WebCraft Pro is provided "as is" without warranties. Our total liability shall not exceed the amount you paid in the 12 months preceding the claim.</p>'
},
cookies: {
title: 'Cookie Policy',
body: '<h3>What Are Cookies?</h3><p>Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and improve your experience.</p><h3>Types We Use</h3><p><strong>Essential:</strong> Required for basic site functionality and security.<br><strong>Analytics:</strong> Help us understand how visitors interact with our site.<br><strong>Marketing:</strong> Used to deliver relevant advertisements.</p><h3>Managing Cookies</h3><p>You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect site functionality.</p>'
},
gdpr: {
title: 'GDPR Compliance',
body: '<h3>Our Commitment</h3><p>WebCraft Pro is fully committed to GDPR compliance. We process personal data lawfully, fairly, and transparently.</p><h3>Data Processing Basis</h3><p>We process your data based on: contract performance, consent, legitimate interests, or legal obligations. You can withdraw consent at any time.</p><h3>Data Subject Rights</h3><p>Under GDPR, you have the right to: access your data, rectification, erasure, data portability, and to object to processing. Contact dpo@webcraftpro.com to exercise these rights.</p>'
},
security: {
title: 'Security',
body: '<h3>Infrastructure Security</h3><p>Our platform runs on enterprise-grade cloud infrastructure with 99.99% uptime SLA. All data centers are SOC 2 Type II certified and ISO 27001 compliant.</p><h3>Application Security</h3><p>We implement OWASP best practices, conduct regular penetration testing, and maintain a responsible disclosure program for security researchers.</p><h3>Data Protection</h3><p>All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We perform daily encrypted backups with 30-day retention and geographic redundancy.</p>'
},
features: {
title: 'Features',
body: '<h3>Visual Builder</h3><p>Drag-and-drop interface with real-time preview. No coding required — build pixel-perfect layouts with our intuitive visual editor.</p><h3>Design System</h3><p>Maintain consistency across your projects with shared design tokens, component libraries, and style guides.</p><h3>One-Click Deploy</h3><p>Publish to our global CDN with a single click. Automatic SSL, optimized performance, and instant rollback capabilities.</p><h3>Analytics & Insights</h3><p>Built-in analytics dashboard with real-time visitor tracking, conversion funnels, and A/B testing tools.</p>'
},
templates: {
title: 'Templates',
body: '<h3>200+ Premium Templates</h3><p>Choose from our curated collection of professionally designed templates. Each template is fully responsive and customizable to match your brand.</p><h3>Categories</h3><p>Business, Portfolio, E-commerce, Blog, SaaS, Landing Page, Agency, and more. New templates added monthly.</p><h3>Custom Templates</h3><p>Professional and Enterprise plans allow you to create and save custom templates for your team.</p>'
},
pricing: {
title: 'Pricing',
body: '<h3>Free Trial</h3><p>Start with a 14-day free trial. No credit card required. Full access to all Professional plan features.</p><h3>Starter — $19/mo</h3><p>3 published websites, 50+ templates, basic analytics, community support.</p><h3>Professional — $49/mo</h3><p>Unlimited websites, 200+ templates, advanced analytics, team collaboration, priority support, code export.</p><h3>Enterprise — Custom</h3><p>Everything in Professional plus unlimited team members, SSO, custom integrations, dedicated account manager, 99.99% SLA.</p>'
},
integrations: {
title: 'Integrations',
body: '<h3>Popular Integrations</h3><p>Connect with the tools you already use: Slack, Notion, Google Analytics, Stripe, Mailchimp, HubSpot, Zapier, and 50+ more.</p><h3>API Access</h3><p>Professional and Enterprise plans include REST API access for custom integrations and automation workflows.</p><h3>Webhooks</h3><p>Set up webhooks to trigger actions in external services when events occur on your site.</p>'
},
changelog: {
title: 'Changelog',
body: '<h3>v3.2 — April 2026</h3><p>✨ New: AI-powered layout suggestions<br>🚀 Improved: 40% faster build times<br>🐛 Fixed: Mobile preview rendering issue</p><h3>v3.1 — March 2026</h3><p>✨ New: Dark mode for the builder<br>🚀 Improved: Template search and filtering<br>🐛 Fixed: Safari animation compatibility</p><h3>v3.0 — February 2026</h3><p>🎉 Major release: Redesigned builder interface<br>✨ New: Component marketplace<br>🚀 Improved: Real-time collaboration</p>'
},
documentation: {
title: 'Documentation',
body: '<h3>Getting Started</h3><p>Quick-start guides to help you build your first website in under 10 minutes. Step-by-step tutorials with screenshots and code examples.</p><h3>API Reference</h3><p>Complete API documentation with interactive examples. RESTful endpoints for content management, deployment, and analytics.</p><h3>Developer Guides</h3><p>Advanced topics including custom components, theme development, and CI/CD integration.</p>'
},
tutorials: {
title: 'Tutorials',
body: '<h3>Video Tutorials</h3><p>Over 100 video tutorials covering everything from basic setup to advanced techniques. New videos added weekly.</p><h3>Written Guides</h3><p>Detailed step-by-step articles with code snippets and downloadable example projects.</p><h3>Community Workshops</h3><p>Join live workshops hosted by our team and community experts. Free for all users.</p>'
},
blog: {
title: 'Blog',
body: '<h3>Latest Articles</h3><p>Insights on web design, development best practices, product updates, and industry trends. Updated weekly by our team and guest authors.</p><h3>Categories</h3><p>Design, Development, Product Updates, Case Studies, Industry Insights, and Tutorials.</p>'
},
community: {
title: 'Community',
body: '<h3>Join Our Community</h3><p>Connect with 10,000+ WebCraft Pro users in our community forum. Share projects, get feedback, and learn from others.</p><h3>Community Events</h3><p>Monthly meetups, hackathons, and design challenges. Participate and win prizes!</p>'
},
help: {
title: 'Help Center',
body: '<h3>Search Our Knowledge Base</h3><p>Find answers to common questions, troubleshooting guides, and how-to articles. Our knowledge base covers every feature in detail.</p><h3>Contact Support</h3><p>Can\'t find what you need? Our support team is available 24/7 for Professional and Enterprise users. Starter users get community support.</p>'
},
about: {
title: 'About WebCraft Pro',
body: '<h3>Our Mission</h3><p>We believe everyone should be able to build beautiful websites. WebCraft Pro makes professional web design accessible to teams of all sizes.</p><h3>Our Story</h3><p>Founded in 2023, WebCraft Pro has grown to serve over 50,000 users across 120 countries. Backed by leading investors and a passionate team of 80+ people.</p><h3>Our Values</h3><p>Simplicity, quality, and customer success drive everything we do. We ship fast, listen closely, and never stop improving.</p>'
},
careers: {
title: 'Careers',
body: '<h3>Join Our Team</h3><p>We\'re a remote-first team of 80+ people across 15 countries. We value curiosity, craftsmanship, and collaboration.</p><h3>Open Positions</h3><p>Senior Frontend Engineer, Product Designer, DevOps Engineer, Customer Success Manager, and more. Check our careers page for the latest openings.</p><h3>Benefits</h3><p>Competitive salary, equity, unlimited PTO, learning budget, home office stipend, and annual team retreats.</p>'
},
press: {
title: 'Press Kit',
body: '<h3>Media Resources</h3><p>Download our brand assets including logos, screenshots, and press photos. All assets are available in high-resolution formats.</p><h3>In The News</h3><p>Featured in TechCrunch, Product Hunt, and Smashing Magazine. Contact press@webcraftpro.com for media inquiries.</p>'
},
contact: {
title: 'Contact Us',
body: '<h3>Get In Touch</h3><p>Have questions? We\'d love to hear from you. Email us at hello@webcraftpro.com or use the contact form below.</p><h3>Office</h3><p>San Francisco, CA (HQ)<br>London, UK<br>Singapore</p>'
},
partners: {
title: 'Partners',
body: '<h3>Partner Program</h3><p>Join our partner program and earn commissions by referring customers to WebCraft Pro. We offer competitive rates and dedicated partner support.</p><h3>Technology Partners</h3><p>We integrate with leading platforms including AWS, Cloudflare, Stripe, and more to deliver the best experience for our users.</p>'
}
};
var _savedScrollY = 0;
function openModal(id) {
var overlay = document.getElementById(id);
if (overlay) {
if (!document.querySelector('.modal-overlay.active')) {
_savedScrollY = window.scrollY;
document.body.style.top = '-' + _savedScrollY + 'px';
document.body.classList.add('overflow-hidden');
}
overlay.classList.add('active');
}
}
function closeModal(id) {
var overlay = document.getElementById(id);
if (overlay) {
overlay.classList.remove('active');
if (!document.querySelector('.modal-overlay.active')) {
document.body.classList.remove('overflow-hidden');
document.body.style.top = '';
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, _savedScrollY);
document.documentElement.style.scrollBehavior = '';
}
}
}
function closeAllModals() {
document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
m.classList.remove('active');
});
document.body.classList.remove('overflow-hidden');
document.body.style.top = '';
document.documentElement.style.scrollBehavior = 'auto';
window.scrollTo(0, _savedScrollY);
document.documentElement.style.scrollBehavior = '';
}
function closeTopModal() {
var modals = document.querySelectorAll('.modal-overlay.active');
if (modals.length) {
var top = modals[0];
modals.forEach(function(m) {
var z = parseInt(getComputedStyle(m).zIndex) || 0;
var zt = parseInt(getComputedStyle(top).zIndex) || 0;
if (z > zt) top = m;
});
closeModal(top.id);
}
}
document.querySelectorAll('.modal__close').forEach(function(btn) {
btn.addEventListener('click', function() {
var id = btn.getAttribute('data-close');
if (id) closeModal(id);
});
});
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
overlay.addEventListener('click', function(e) {
if (e.target === overlay) closeTopModal();
});
});
document.addEventListener('keydown', function(e) {
if (e.key === 'Escape') closeTopModal();
});
document.querySelectorAll('[data-modal]').forEach(function(el) {
el.addEventListener('click', function(e) {
e.preventDefault();
closeAllModals();
openModal(el.getAttribute('data-modal'));
});
});
document.querySelectorAll('[data-footer-page]').forEach(function(el) {
el.addEventListener('click', function(e) {
e.preventDefault();
e.stopPropagation();
var key = el.getAttribute('data-footer-page');
var page = footerPages[key];
if (page) {
document.getElementById('pageModalTitle').textContent = page.title;
document.getElementById('pageModalBody').innerHTML = page.body;
openModal('pageModal');
}
});
});
document.querySelectorAll('.btn--ghost, .btn--secondary').forEach(function(btn) {
if (btn.textContent.trim() === 'Log in') {
btn.addEventListener('click', function(e) {
e.preventDefault();
openModal('loginModal');
});
}
});
document.querySelectorAll('.btn--primary, .btn--white').forEach(function(btn) {
var t = btn.textContent.trim();
if (t.indexOf('Start Free Trial') !== -1 || t.indexOf('Get Started') !== -1 || t.indexOf('Start Building') !== -1) {
btn.addEventListener('click', function(e) {
e.preventDefault();
openModal('signupModal');
});
}
});
document.querySelectorAll('.btn--dark').forEach(function(btn) {
if (btn.textContent.trim() === 'Contact Sales') {
btn.addEventListener('click', function(e) {
e.preventDefault();
document.getElementById('contactModalTitle').textContent = 'Contact Sales';
document.getElementById('contactModalSubtitle').textContent = 'Tell us about your enterprise needs and we\'ll get back to you within 24 hours.';
openModal('contactModal');
});
}
});
document.querySelectorAll('.btn--outline-white').forEach(function(btn) {
if (btn.textContent.trim() === 'Schedule a Demo') {
btn.addEventListener('click', function(e) {
e.preventDefault();
document.getElementById('contactModalTitle').textContent = 'Schedule a Demo';
document.getElementById('contactModalSubtitle').textContent = 'Book a personalized demo with our team. We\'ll walk you through the platform and answer your questions.';
openModal('contactModal');
});
}
});
document.querySelectorAll('.btn--secondary').forEach(function(btn) {
if (btn.textContent.trim() === 'Watch Demo') {
btn.addEventListener('click', function(e) {
e.preventDefault();
openModal('demoModal');
});
}
});
document.querySelectorAll('.footer__links a').forEach(function(a) {
a.addEventListener('click', function(e) {
e.preventDefault();
var text = a.textContent.trim().toLowerCase().replace(/\s+/g, '');
var keyMap = {
'features': 'features', 'templates': 'templates', 'pricing': 'pricing',
'integrations': 'integrations', 'changelog': 'changelog',
'documentation': 'documentation', 'tutorials': 'tutorials',
'blog': 'blog', 'community': 'community', 'helpcenter': 'help',
'about': 'about', 'careers': 'careers', 'presskit': 'press',
'contact': 'contact', 'partners': 'partners',
'privacypolicy': 'privacy', 'termsofservice': 'terms',
'cookiepolicy': 'cookies', 'gdpr': 'gdpr', 'security': 'security'
};
var key = keyMap[text];
if (key && footerPages[key]) {
document.getElementById('pageModalTitle').textContent = footerPages[key].title;
document.getElementById('pageModalBody').innerHTML = footerPages[key].body;
openModal('pageModal');
}
});
});
document.querySelectorAll('.footer__social a').forEach(function(a) {
a.addEventListener('click', function(e) {
e.preventDefault();
var title = a.getAttribute('title');
var bodies = {
'Twitter': '<h3>Follow us on X (Twitter)</h3><p>Stay updated with the latest product news, tips, and community highlights. Follow @webcraftpro for daily inspiration.</p>',
'GitHub': '<h3>Open Source on GitHub</h3><p>Explore our open-source projects, contribute to the ecosystem, and star our repos. github.com/webcraftpro</p>',
'LinkedIn': '<h3>Connect on LinkedIn</h3><p>Follow our company page for industry insights, team stories, and career opportunities.</p>',
'YouTube': '<h3>Watch on YouTube</h3><p>Tutorials, product demos, and web design tips. Subscribe to our channel for weekly content.</p>'
};
if (bodies[title]) {
document.getElementById('pageModalTitle').textContent = title;
document.getElementById('pageModalBody').innerHTML = bodies[title];
openModal('pageModal');
}
});
});
var ctaSection = document.getElementById('ctaSection');
if (ctaSection) {
var ctaObs = new IntersectionObserver(function(entries) {
if (entries[0].isIntersecting) {
ctaSection.classList.add('cta--animated');
ctaObs.unobserve(ctaSection);
}
}, { threshold: 0.1 });
ctaObs.observe(ctaSection);
}
var resizeTimer;
window.addEventListener('resize', function() {
clearTimeout(resizeTimer);
resizeTimer = setTimeout(function() {
isMobile = window.matchMedia('(max-width: 768px)').matches;
isTablet = window.matchMedia('(max-width: 1024px)').matches;
if (!isMobile && mobileMenu && mobileMenu.classList.contains('open')) {
closeMobileMenu();
}
}, 150);
});
})();
