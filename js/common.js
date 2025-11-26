function fullScreenToggle(block, btn) {

    let blockEl = null;
    let blockBtn = null;

    if (block instanceof HTMLElement) {
        blockEl = block;
    } else if (typeof block === 'string') {
        blockEl = document.querySelector(block);
    }
    if (!blockEl) return;

    if (btn) {
        if (btn instanceof HTMLElement) {
            btnEl = btn;
        } else if (typeof btn === 'string') {
            btnEl = document.querySelector(btn);
        }
    } else {
        let checkBtn = blockEl.querySelector('._s_toggle_btn');
        if (!checkBtn) {
            blockBtn = blockEl
        } else {
            blockBtn = checkBtn
        }
    }

    blockBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        } else {
            blockEl.dataset.position = window.scrollY;
            blockEl.requestFullscreen();
        }
    })

    addEventListener("fullscreenchange", (e) => {

        if (!document.fullscreenElement) { // exit to normal
            if (blockEl.dataset.position) {
                let scrollToPos = +blockEl.dataset.position;
                setTimeout(() => {
                    blockEl.dataset.position = '';
                    window.scrollTo(0, scrollToPos);
                }, 100)
            }
        }

    })

}