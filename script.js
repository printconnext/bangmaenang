document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle Icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for navbar height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Update Active Link on Scroll
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. Fetch News from Supabase
    async function fetchNews() {
        const newsContainer = document.getElementById('news-container');
        if (!newsContainer || typeof supabase === 'undefined') return;

        try {
            // Fetch latest 3 news items ordered by created_at descending
            // Make sure you have created a table named 'news' in Supabase
            const { data: newsItems, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) {
                console.error('Error fetching news:', error);
                newsContainer.innerHTML = '<p style="text-align:center; color:#ef4444; width:100%;">ไม่สามารถโหลดข้อมูลข่าวสารได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>';
                return;
            }

            if (!newsItems || newsItems.length === 0) {
                newsContainer.innerHTML = '<p style="text-align:center; color:#64748b; width:100%;">ยังไม่มีข่าวสารหรือประกาศในขณะนี้</p>';
                return;
            }

            // Generate HTML for each news card
            let html = '';
            newsItems.forEach(item => {
                // Determine image to use, fallback to a placeholder if none
                const bgImage = item.image_url ? item.image_url : 'news1.jpg';

                // Format the date if date_str is provided, otherwise format created_at (basic fallback)
                const dateDisplay = item.date_str || new Date(item.created_at).toLocaleDateString('th-TH');

                html += `
                <article class="news-card">
                    <div class="news-img" style="background-image: url('${bgImage}')"></div>
                    <div class="news-content">
                        <span class="news-date"><i class="fa-regular fa-calendar-alt"></i> ${dateDisplay}</span>
                        <h3>${item.title || 'ไม่มีหัวข้อ'}</h3>
                        <p>${item.content || ''}</p>
                        <!-- For a real app, href could link to a dedicated news page with the item ID -->
                        <a href="#" class="read-more">อ่านต่อ <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </article>
                `;
            });

            newsContainer.innerHTML = html;

        } catch (err) {
            console.error('Exception fetching news:', err);
            newsContainer.innerHTML = '<p style="text-align:center; color:#ef4444; width:100%;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
        }
    }

    // Call the function to load news
    fetchNews();

});
