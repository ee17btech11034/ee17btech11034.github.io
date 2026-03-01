// Array format handles the new layout requirement

const container = document.querySelector('.timeline-container');
const rope = document.querySelector('.timeline-rope');

const vComet = document.createElement('div');
const hComet = document.createElement('div');
vComet.className = 'comet-v';
hComet.className = 'comet-h';
container.appendChild(vComet);
container.appendChild(hComet);

journeyData.forEach((item, index) => {
    const box = document.createElement('div');
    const isExp = item.type === 'exp';
    box.className = `work-box ${isExp ? 'type-experience' : 'type-project'}`;
    const color = isExp ? '#10b981' : '#f59e0b';

    // FIX 2 & 3: Map the description array to <li> tags dynamically
    const pointsHTML = item.desc.map(point => `<li>${point}</li>`).join('');

    box.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="work-content">
            <div class="work-header">
                <h3 class="work-title">${item.title}</h3>
                <span class="work-date" style="color: ${color}">${item.date}</span>
                <p class="work-org">${item.company}</p>
                <span class="work-loc">${item.location}</span>
            </div>
            <ul class="work-desc-list">
                ${pointsHTML}
            </ul>
        </div>
    `;

    container.appendChild(box);

    const dot = box.querySelector('.timeline-dot');
    const content = box.querySelector('.work-content');

    box.addEventListener('mouseenter', () => {
        container.classList.add('is-hovering');
        container.style.setProperty('--active-color', color);

        const cRect = container.getBoundingClientRect();
        const dRect = dot.getBoundingClientRect();
        const bRect = content.getBoundingClientRect();

        const dotY = dRect.top - cRect.top + (dRect.height / 2);
        const boxXStart = dRect.left - cRect.left + (dRect.width / 2);
        const boxXEnd = bRect.left - cRect.left;

        vComet.style.transition = 'none';
        vComet.style.transform = `translateY(-100px)`; 
        vComet.style.opacity = '0';

        requestAnimationFrame(() => {
            vComet.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.1s';
            vComet.style.opacity = '1';
            vComet.style.transform = `translateY(${dotY - 45}px)`;
        });

        setTimeout(() => {
            if (!box.matches(':hover')) return;

            vComet.style.opacity = '0'; 
            dot.classList.add('dot-glow'); 

            hComet.style.transition = 'none';
            hComet.style.top = `${dotY - 1}px`; 
            hComet.style.left = `${boxXStart}px`;
            hComet.style.width = '0';
            hComet.style.opacity = '1';

            requestAnimationFrame(() => {
                hComet.style.transition = 'width 0.2s ease-out';
                hComet.style.width = `${boxXEnd - boxXStart}px`;
            });
        }, 420);

        setTimeout(() => {
            if (!box.matches(':hover')) return;
            content.classList.add('box-glow');
            hComet.style.opacity = '0'; 
        }, 620);
    });

    box.addEventListener('mouseleave', () => {
        container.classList.remove('is-hovering');
        vComet.style.opacity = '0';
        hComet.style.opacity = '0';
        hComet.style.width = '0';
        dot.classList.remove('dot-glow');
        content.classList.remove('box-glow');
    });

    if (index === journeyData.length - 1) {
        setTimeout(() => {
            rope.style.height = `${dot.offsetTop + 6}px`;
        }, 100);
    }
});




const trigger = document.getElementById('journey-trigger');

trigger.addEventListener('click', () => {
    // 1. Trigger a "Warp" effect (Optional: flash the screen white)
    document.body.style.filter = "brightness(2) contrast(1.2)";
    
    setTimeout(() => {
        // 2. Call the function to load the next commit
        loadNextCommit(); 
        
        // 3. Reset the screen brightness
        document.body.style.filter = "none";
    }, 300);
});