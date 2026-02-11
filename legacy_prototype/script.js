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

    // --- Dynamic Meeting Logic ---

    // Initial Data
    let meetings = [
        {
            id: 'gangnamCard',
            title: '강남역 근처 카페 같이 가실 분?',
            desc: '주말에 강남역에서 예쁜 카페 투어하고 싶은 분 계신가요? 3명 모집합니다!',
            location: '강남역 10번 출구',
            time: 'Upcoming Saturday, 14:00 PM',
            host: 'HoiHoiUnicorn',
            hostDate: '2026. 2. 10. 오후 1:04:47',
            max: 4,
            current: 1, // Start with 1 (Host)
            joined: false,
            img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            chat: [
                { user: 'Host', text: 'Hi everyone! Thanks for joining our cafe meetup.', isMe: false }
            ]
        }
    ];

    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const navBar = document.querySelector('.nav-bar');
    const meetupDetail = document.getElementById('meetupDetail');
    const backBtn = document.getElementById('backBtn');

    // UI Elements for Detail View
    const detailTitle = meetupDetail.querySelector('h1');
    const detailDesc = meetupDetail.querySelector('p');
    const detailLocation = meetupDetail.querySelectorAll('.container > div > div:last-child > div:first-child > div:last-child > div:last-child')[0]; // Bit hacky selector, should optimize
    const detailTime = meetupDetail.querySelectorAll('.container > div > div:last-child > div:first-child > div:last-child > div:last-child')[1];

    // Better selections for detail info
    const infoSection = meetupDetail.querySelector('.container > div > div:nth-child(2) > div:nth-child(4)');

    // Elements for Action
    const joinActionBtn = document.getElementById('joinActionBtn');
    const currentCountSpan = document.getElementById('currentCount');
    const progressBar = document.getElementById('progressBar');
    const userAvatar = document.getElementById('userAvatar');
    const chatHistory = document.getElementById('chatHistory');

    let currentMeetingId = null;

    // Render Logic
    function renderMeetings() {
        // Find the "gangnamCard" in DOM and remove it if it exists (to avoid duplicate from HTML)
        const staticCard = document.getElementById('gangnamCard');
        if (staticCard) staticCard.remove();

        meetings.forEach(meeting => {
            // Check if already rendered to avoid duplicates if we call this multiple times (simple implementation: clear and re-render or check existence)
            // For now, let's just create if not exists
            if (document.getElementById(meeting.id)) return;

            const article = document.createElement('article');
            article.className = 'post-card';
            article.dataset.category = 'meetup';
            article.id = meeting.id;

            // Calculate status text
            const statusText = `${meeting.current + (meeting.joined ? 0 : 0)} / ${meeting.max} participants`;

            article.innerHTML = `
                <div class="post-header">
                    <div style="display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #ddd; overflow: hidden;">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="User" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 700; font-size: 0.9rem;">${meeting.host}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${meeting.hostDate}</div>
                        </div>
                        <span class="tag" style="background-color: #f3e8ff; color: #7e22ce;">만남의 장</span>
                    </div>
                </div>
                <h3 class="post-title" style="margin-top: 0.5rem;">${meeting.title}</h3>
                <p class="post-excerpt" style="margin-bottom: 0.5rem;">${meeting.desc}</p>
                <div style="background-color: #e5e7eb; height: 180px; border-radius: 0.5rem; margin-bottom: 1rem; overflow: hidden;">
                    <img src="${meeting.img}" alt="Meeting Image" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.9rem;">
                        <i class="fas fa-map-marker-alt" style="color: var(--primary-color);"></i>
                        <span>${meeting.location}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem;">
                        <i class="fas fa-users" style="color: #10b981;"></i>
                        <span class="card-count">${statusText}</span>
                    </div>
                </div>
                <button class="btn btn-primary full-width join-trigger-btn" style="font-weight: 700;">${meeting.joined ? 'Cancel Meetup' : 'Join Meetup'}</button>
            `;

            // Style adjustment for joined state on card
            const btn = article.querySelector('.join-trigger-btn');
            if (meeting.joined) {
                btn.classList.remove('btn-primary');
                btn.style.backgroundColor = '#e11d48';
            }

            // Bind Events
            article.addEventListener('click', () => openDetail(meeting.id));
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openDetail(meeting.id);
            });

            // Append to Main (after the static posts, before the modal)
            // Ideally append to main. 
            mainContent.appendChild(article);
        });
    }

    function openDetail(id) {
        const meeting = meetings.find(m => m.id === id);
        if (!meeting) return;

        currentMeetingId = id;

        // Populate Detail View
        detailTitle.textContent = meeting.title;
        detailDesc.textContent = meeting.desc;

        // Update Info Section (Manual traversal as selector was tricky)
        const locationDiv = infoSection.children[0].children[1].children[1];
        const timeDiv = infoSection.children[1].children[1].children[1];
        locationDiv.textContent = meeting.location;
        timeDiv.textContent = meeting.time;

        // Update Status
        updateDetailStatus(meeting);

        // Update Chat
        renderChat(meeting);

        // Show View
        mainContent.classList.add('hidden');
        header.classList.add('hidden');
        navBar.classList.add('hidden');
        meetupDetail.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    function updateDetailStatus(meeting) {
        const total = meeting.max;
        const current = meeting.current + (meeting.joined ? 1 : 0);

        // Update valid count checks
        const displayCount = current > total ? total : current;

        currentCountSpan.parentNode.innerHTML = `<span id="currentCount">${displayCount}</span>/${total}명`;
        progressBar.style.width = `${(displayCount / total) * 100}%`;

        if (meeting.joined) {
            joinActionBtn.textContent = '모임 참여 취소';
            joinActionBtn.style.backgroundColor = '#fff1f2';
            joinActionBtn.style.color = '#e11d48';
            userAvatar.classList.remove('hidden');
        } else {
            joinActionBtn.textContent = 'Join Meetup';
            joinActionBtn.style.backgroundColor = '#2563EB';
            joinActionBtn.style.color = 'white';
            userAvatar.classList.add('hidden');
        }
    }

    function renderChat(meeting) {
        chatHistory.innerHTML = ''; // Clear old

        meeting.chat.forEach(msg => {
            const msgDiv = document.createElement('div');

            if (msg.isMe) {
                msgDiv.style.alignSelf = 'flex-end';
                msgDiv.innerHTML = `
                    <div style="background-color: var(--primary-color); color: white; padding: 0.75rem; border-radius: 1rem 1rem 0 1rem; font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                        ${msg.text}
                    </div>
                `;
            } else {
                msgDiv.style.display = 'flex';
                msgDiv.style.gap = '0.5rem';
                msgDiv.innerHTML = `
                    <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0;">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div>
                        <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary-color); margin-bottom: 0.25rem;">${msg.user}</div>
                        <div style="background-color: white; padding: 0.75rem; border-radius: 0 1rem 1rem 1rem; border: 1px solid var(--border-color); font-size: 0.9rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            ${msg.text}
                        </div>
                    </div>
                `;
            }
            chatHistory.appendChild(msgDiv);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Action Button Logic
    joinActionBtn.addEventListener('click', () => {
        if (!currentMeetingId) return;
        const meeting = meetings.find(m => m.id === currentMeetingId);

        meeting.joined = !meeting.joined;

        // Update Detail View
        updateDetailStatus(meeting);

        // Update Card View
        const card = document.getElementById(meeting.id);
        const btn = card.querySelector('.join-trigger-btn');
        const count = card.querySelector('.card-count');

        const total = meeting.max;
        const current = meeting.current + (meeting.joined ? 1 : 0);
        count.textContent = `${current} / ${total} participants`;

        if (meeting.joined) {
            btn.textContent = 'Cancel Meetup';
            btn.classList.remove('btn-primary');
            btn.style.backgroundColor = '#e11d48';
        } else {
            btn.textContent = 'Join Meetup';
            btn.classList.add('btn-primary');
            btn.style.backgroundColor = '';
        }
    });

    // Chat Input Logic
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');

    function sendChatMessage() {
        const text = chatInput.value.trim();
        if (!text || !currentMeetingId) return;

        const meeting = meetings.find(m => m.id === currentMeetingId);

        if (!meeting.joined) {
            alert("모임에 참여해야 채팅을 할 수 있습니다.");
            return;
        }

        meeting.chat.push({ user: 'Me', text: text, isMe: true });

        renderChat(meeting);
        chatInput.value = '';
    }

    sendMessageBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // Back Button
    backBtn.addEventListener('click', () => {
        meetupDetail.classList.add('hidden');
        mainContent.classList.remove('hidden');
        header.classList.remove('hidden');
        navBar.classList.remove('hidden');
        currentMeetingId = null;
    });

    // --- Create Meeting Logic ---
    const createMeetingBtn = document.getElementById('createMeetingBtn');
    const createMeetingModal = document.getElementById('createMeetingModal');
    const createModalClose = document.getElementById('createModalClose');
    const createSubmitBtn = document.getElementById('createSubmitBtn');

    function openCreateModal() {
        createMeetingModal.classList.add('open');
    }

    function closeCreateModal() {
        createMeetingModal.classList.remove('open');
    }

    if (createMeetingBtn) createMeetingBtn.addEventListener('click', openCreateModal);
    if (createModalClose) createModalClose.addEventListener('click', closeCreateModal);
    if (createMeetingModal) createMeetingModal.addEventListener('click', (e) => {
        if (e.target === createMeetingModal) closeCreateModal();
    });

    createSubmitBtn.addEventListener('click', () => {
        const title = document.getElementById('meetTitle').value;
        const desc = document.getElementById('meetDesc').value;
        const location = document.getElementById('meetLocation').value;
        const time = document.getElementById('meetTime').value;
        const max = parseInt(document.getElementById('meetMax').value);

        if (!title || !location || !time || !max) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        const newMeeting = {
            id: 'meet_' + Date.now(),
            title: title,
            desc: desc || title,
            location: location,
            time: time,
            host: 'Me (User)',
            hostDate: new Date().toLocaleDateString(),
            max: max,
            current: 1, // Host
            joined: true, // Auto-join as host
            img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', // Default image
            chat: [
                { user: 'System', text: '모임이 생성되었습니다.', isMe: false }
            ]
        };

        meetings.unshift(newMeeting); // Add to top
        renderMeetings();
        closeCreateModal();

        // Reset Inputs
        document.getElementById('meetTitle').value = '';
        document.getElementById('meetDesc').value = '';
        document.getElementById('meetLocation').value = '';
        document.getElementById('meetTime').value = '';
        document.getElementById('meetMax').value = '4';
    });

    // Initial Render
    renderMeetings();
