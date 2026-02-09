document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const modalOverlay = document.getElementById('loginModal');
    const modalClose = document.getElementById('modalClose');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verifyBtn = document.getElementById('verifyBtn');
    const verificationSection = document.getElementById('verificationSection');
    const phoneInput = document.getElementById('phoneInput');
    const codeInput = document.getElementById('codeInput');
    const userDisplay = document.getElementById('userDisplay');
    const loginButtons = document.getElementById('loginButtons');
    const step1 = document.getElementById('step1');

    // State
    let formattedPhone = '';

    // Functions
    function openModal() {
        modalOverlay.classList.add('open');
        phoneInput.focus();
    }

    function closeModal() {
        modalOverlay.classList.remove('open');
        resetModal();
    }

    function resetModal() {
        step1.classList.remove('hidden');
        verificationSection.classList.add('hidden');
        phoneInput.value = '';
        codeInput.value = '';
    }

    // Event Listeners
    loginBtn.addEventListener('click', openModal);

    modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    sendCodeBtn.addEventListener('click', () => {
        const phone = phoneInput.value;
        if (phone.length < 10) {
            alert('유효한 전화번호를 입력해주세요.');
            return;
        }

        // Mock sending code
        formattedPhone = phone;
        step1.classList.add('hidden');
        verificationSection.classList.remove('hidden');

        // Auto-focus code input
        codeInput.focus();
        alert(`인증번호가 발송되었습니다. (테스트용: 123456)`);
    });

    verifyBtn.addEventListener('click', () => {
        const code = codeInput.value;
        if (code === '123456') {
            // Success
            login();
        } else {
            alert('인증번호가 올바르지 않습니다.');
        }
    });

    function login() {
        closeModal();
        // Update UI to show logged in state
        loginButtons.classList.add('hidden');
        userDisplay.classList.remove('hidden');
        userDisplay.querySelector('span').textContent = formattedPhone;

        alert('로그인되었습니다!');
    }
    // Filter Logic
    const navItems = document.querySelectorAll('.nav-item');
    const posts = document.querySelectorAll('.post-card');
    const postsCount = document.querySelector('.content-header h2');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            const category = item.getAttribute('data-category');
            let visibleCount = 0;

            posts.forEach(post => {
                const postCategory = post.getAttribute('data-category');

                if (category === 'all' || category === postCategory) {
                    post.style.display = 'block';
                    visibleCount++;
                } else {
                    post.style.display = 'none';
                }
            });

            // Update count text
            postsCount.textContent = `${visibleCount} 개의 게시물`;
        });
    });
});
