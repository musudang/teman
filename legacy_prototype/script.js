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

    // --- New Feature: Meetup Detail Logic ---
    const gangnamCard = document.getElementById('gangnamCard');
    const meetupDetail = document.getElementById('meetupDetail');
    const backBtn = document.getElementById('backBtn');
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const navBar = document.querySelector('.nav-bar');

    // Open Detail View
    if (gangnamCard) {
        gangnamCard.addEventListener('click', () => {
            mainContent.classList.add('hidden');
            header.classList.add('hidden');
            navBar.classList.add('hidden');
            meetupDetail.classList.remove('hidden');
            window.scrollTo(0, 0);
        });
    }

    // Close Detail View (Back)
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            meetupDetail.classList.add('hidden');
            mainContent.classList.remove('hidden');
            header.classList.remove('hidden');
            navBar.classList.remove('hidden');
        });
    }

    // Join/Cancel Logic
    const joinActionBtn = document.getElementById('joinActionBtn');
    const joinBtnCard = document.getElementById('joinBtnCard');
    const currentCountSpan = document.getElementById('currentCount');
    const progressBar = document.getElementById('progressBar');
    const userAvatar = document.getElementById('userAvatar');
    const cardParticipantCount = document.getElementById('cardParticipantCount');

    let isJoined = false;
    let participantCount = 2; // Initial count

    function toggleJoin() {
        isJoined = !isJoined;

        if (isJoined) {
            // State: Joined
            participantCount++;
            joinActionBtn.textContent = '모임 참여 취소';
            joinActionBtn.style.backgroundColor = '#fff1f2';
            joinActionBtn.style.color = '#e11d48';

            // Update Card Button as well for consistency
            if (joinBtnCard) joinBtnCard.textContent = 'Cancel Meetup';
            if (joinBtnCard) joinBtnCard.classList.remove('btn-primary');
            if (joinBtnCard) joinBtnCard.style.backgroundColor = '#e11d48';

            // Update UI
            currentCountSpan.textContent = participantCount;
            if (cardParticipantCount) cardParticipantCount.textContent = `${participantCount} / 4 participants`;
            progressBar.style.width = `${(participantCount / 4) * 100}%`;
            userAvatar.classList.remove('hidden');
        } else {
            // State: Not Joined
            participantCount--;
            joinActionBtn.textContent = 'Join Meetup';
            joinActionBtn.style.backgroundColor = '#2563EB'; // Primary color
            joinActionBtn.style.color = 'white';

            // Update Card Button
            if (joinBtnCard) joinBtnCard.textContent = 'Join Meetup';
            if (joinBtnCard) joinBtnCard.classList.add('btn-primary');
            if (joinBtnCard) joinBtnCard.style.backgroundColor = ''; // Reset to class style

            // Update UI
            currentCountSpan.textContent = participantCount;
            if (cardParticipantCount) cardParticipantCount.textContent = `${participantCount} / 4 participants`;
            progressBar.style.width = `${(participantCount / 4) * 100}%`;
            userAvatar.classList.add('hidden');
        }
    }

    if (joinActionBtn) {
        joinActionBtn.addEventListener('click', toggleJoin);
        // Initialize state (default is joined in the screenshot?? No, let's assume not linked yet or match screenshot)
        // Screenshot shows "Join Meetup" on card, but "Cancel" on detail. Let's sync them.
        // If the detail view screenshot has "Cancel", it means the user has joined.
        // Let's default to "Not Joined" for the user to experience the flow, 
        // OR default to "Joined" if we want to match the detail screenshot exactly.
        // The user said "Activate functionality", so starting from unjoined makes more sense for interaction testing.
        // actually, let's make it unjoined initially so they can click it.

        // Reset to unjoined state initially to match the "Join Meetup" button on the card
        joinActionBtn.textContent = 'Join Meetup';
        joinActionBtn.style.backgroundColor = '#2563EB';
        joinActionBtn.style.color = 'white';
        // But wait, the screenshot 2 shows "Cancel". I will prioritize the "User wants to participate" flow.
    }

    if (joinBtnCard) {
        joinBtnCard.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening detail view immediately if clicking button? 
            // Actually, maybe clicking button should also open detail view OR just toggle.
            // Let's let it bubble to open the view, but maybe auto-join?
            // For now, let's just let it open the view.
            gangnamCard.click();
        });
    }


    // Chat Logic
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatHistory = document.getElementById('chatHistory');

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            const msgDiv = document.createElement('div');
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.innerHTML = `
                <div style="background-color: var(--primary-color); color: white; padding: 0.75rem; border-radius: 1rem 1rem 0 1rem; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                    ${text}
                </div>
            `;
            chatHistory.appendChild(msgDiv);
            chatInput.value = '';
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
