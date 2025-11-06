// props
// let props = {
//     gallery: HTMLElement

// }

// check browser and version
let safariVersion = null;
if (navigator.userAgent.match(/AppleWebKit.*Version.*Safari/i)) {
    let version = navigator.userAgent.match(/version\/(\d+)\./i);
    if (Array.isArray(version)) {
        safariVersion = +version[1];
    }
}
// console.dir(safariVersion);


// desktop script only

function gazetaGallery(props) {

    const gallery = props.gallery;

    let limit = props.limit || null;
    let isIncut = gallery.dataset.isincut || null;

    let imageCounter = 0;

    const mainarea = gallery.querySelector('.b_photoreport-mainarea') || null;
    const mainSlider = mainarea.querySelector('.slider') || null;
    const mainItemsCollect = mainSlider.querySelectorAll('.item') || null;
    const inTotalImg = Array.from(mainItemsCollect).filter(el => el.tagName == 'FIGURE').length;

    const preview = gallery.querySelector('.b_photoreport-preview') || null;
    const previewSlider = preview.querySelector('.slider') || null;
    const previewItemsCollect = previewSlider.querySelectorAll('.item') || null;

    const info = gallery.querySelector('.b_photoreport-info') || null;
    const picsign = info.querySelector('.picsign') || null;
    const copyright = info.querySelector('.copyright') || null;

    const controlBtns = gallery.querySelectorAll('.b_photoreport-controlbtn') || null;

    const fullscreenBtn = gallery.querySelector('.b_photoreport-fullscreen-btn') || null;

    function btnHolder(e) {

        const btn = this;

        if (btn.classList.contains('m_disable')) return;

        if (btn.classList.contains('m_right')) {
            ++imageCounter;
        } else {
            --imageCounter;
        }

        if (imageCounter < 0) {
            imageCounter = 0;
        } else if (imageCounter > (mainItemsCollect.length - 1)) {
            imageCounter = mainItemsCollect.length - 1;
        }

        changeItem(imageCounter);
    }

    function btnActivity() {
        controlBtns.forEach(el => {

            el.classList.remove('m_disable');

            if (imageCounter == 0 && el.classList.contains('m_left')) {
                el.classList.add('m_disable')
            }
            if (imageCounter == (mainItemsCollect.length - 1) && el.classList.contains('m_right')) {
                el.classList.add('m_disable')
            }

        });
    }

    function loadSrc(itemNum, once) {

        if (mainItemsCollect[itemNum]) {
            let itemImage = mainItemsCollect[itemNum].querySelector('.item-image') || null;

            if (itemImage && itemImage.dataset.hq) {

                if (!isIncut && itemImage.src != itemImage.dataset.hq) {
                    let imgHq = new Image();
                    imgHq.src = itemImage.dataset.hq;
                    imgHq.onload = () => {
                        itemImage.src = itemImage.dataset.hq;
                    }
                }

            }

            if (!once) {
                // siblings image src check
                for (let i = itemNum - 2; i <= itemNum + 2; i++) {
                    if (i >= 0 && i <= inTotalImg) {
                        loadSrc(i, 'once');
                    }
                }
            }
        }

    }

    function setCaption(itemNum) {

        if (picsign && copyright) {

            picsign.innerHTML = '';
            copyright.innerHTML = '';

            let itemImage = mainItemsCollect[itemNum].querySelector('.item-image') || null;

            if (itemImage) {

                if (itemImage.dataset.caption != '') {
                    picsign.classList.remove('hide');
                    picsign.innerHTML = itemImage.dataset.caption;
                } else {
                    picsign.classList.add('hide');
                }
                if (itemImage.dataset.author != '') {
                    copyright.classList.remove('hide');
                    copyright.innerHTML = itemImage.dataset.author;
                } else {
                    copyright.classList.add('hide');
                }
            }
        }

    }
    setCaption(imageCounter);

    function addUrlParams(itemNum) {

        if (!limit) {

            let currentUrl = location.origin + location.pathname;
            let curPhoto = itemNum + 1 > inTotalImg ? inTotalImg : itemNum + 1;

            if (location.search != '') {

                if (location.search.match(/photo_num=\d+/)) {
                    currentUrl = currentUrl + location.search.replace(/photo_num=\d+/, 'photo_num=' + curPhoto);
                } else {

                    currentUrl = currentUrl + location.search + '&photo_num=' + curPhoto;
                }

            } else {
                currentUrl = currentUrl + '?p=main&photo_num=' + curPhoto;
            }

            history.replaceState(null, '', currentUrl);

            if (window.g_gazeta_counters_reload) {
                g_gazeta_counters_reload();
            }
        }

    }

    function previewItemHolder(itemNum) {
        if (previewSlider) {

            let activeItem = null;
            activeItem = previewSlider.querySelector('.item.active') || null;
            if (activeItem) {
                activeItem.classList.remove('active');
            }

            if (previewItemsCollect[itemNum]) {
                activeItem = previewItemsCollect[itemNum];
                activeItem.classList.add('active');
                activeItem.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
            }

        }
    }

    function slideMove(pos, behavior) {
        if (behavior == 'instant') {

            mainSlider.scrollLeft = pos;

        } else {

            let duration = 500;
            let timeStart = null;
            let sliderStartPos = mainSlider.scrollLeft;

            function easing(t) {
                return 1 - Math.pow(1 - t, 3); //easeOutCubic
            }

            function animateSliderScroll(timeNow) {

                if (!timeStart) {
                    timeStart = timeNow;
                }

                let progress = (timeNow - timeStart) / duration;
                if (progress > 1) {
                    progress = 1;
                }

                let k = easing(progress);
                let scrollToPos = sliderStartPos + ((pos - sliderStartPos) * k);

                mainSlider.scrollLeft = scrollToPos;

                if (progress < 1) {
                    requestAnimationFrame(animateSliderScroll);
                }

            }

            requestAnimationFrame(animateSliderScroll);
        }
    }

    function changeItem(itemNum, slideMoveType) {

        requestAnimationFrame(() => {

            slideMove(mainItemsCollect[itemNum].offsetLeft, slideMoveType);

        })
        loadSrc(itemNum);
        btnActivity();
        setCaption(itemNum);
        addUrlParams(itemNum);
        previewItemHolder(itemNum);
    }

    function fullScreenToggle() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
        } else {
            gallery.requestFullscreen();
        }
    }

    if (controlBtns) {
        controlBtns.forEach(btn => {
            btn.addEventListener('click', btnHolder.bind(btn))
        })
    }

    // наличие лимита в фотогалереи, говорит о том, что это врез и часть событий не должны обрабатываться
    if (!limit) {

        if (location.search.match(/photo_num=(\d+)/)) {
            let requiredPhoto = +location.search.match(/photo_num=(\d+)/)[1] - 1;
            if (requiredPhoto >= 0 && requiredPhoto < inTotalImg) {
                imageCounter = requiredPhoto;

                setTimeout(() => {
                    changeItem(imageCounter, 'instant');
                }, 300)

            }
        }

        document.addEventListener('keydown', e => {
            let direction = '';
            if (e.keyCode == 39 || e.code == 'ArrowRight') {
                direction = 'm_right';
            } else if (e.keyCode == 37 || e.code == 'ArrowLeft') {
                direction = 'm_left';
            }
            controlBtns.forEach(btn => {
                if (btn.classList.contains(direction)) {
                    btnHolder.bind(btn)(e)
                }
            })

        })
    }

    fullscreenBtn.addEventListener('click', fullScreenToggle)

    mainSlider.addEventListener('click', e => {
        if (!document.fullscreenElement) {
            gallery.requestFullscreen();
        }
    })

    window.addEventListener('resize', () => {
        changeItem(imageCounter, 'instant');
    })

}