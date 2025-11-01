// props
// let props = {
//     gallery: HTMLElement

// }

// check browser and version
    let safariVersion = null;
    if(navigator.userAgent.match(/AppleWebKit.*Version.*Safari/i)){
        let version = navigator.userAgent.match(/version\/(\d+)\./i);
        if(Array.isArray(version)){
            safariVersion = +version[1];
        }
    }
    // console.dir(safariVersion);

function btnHolder(e) {
    const btn = this;

    // mainItemsCollect[++counter].scrollIntoView(
    //     { behavior: "smooth", block: "nearest", inline: "nearest" }
    // )

    // mainSlider.scrollIntoView(
    //     {behavior: "smooth", block: "center", inline: "start"}
    // )

    // console.log('btn is')
    // console.dir(btn);

    // console.log('and e is')
    // console.debug(e);
}


function gazetaGallery(props) {
    
    const gallery = props.gallery;

    let limit = props.limit || null;
    let isIncut = gallery.dataset.isincut || null;

    let counter = 0;

    const mainarea = gallery.querySelector('.b_photoreport-mainarea') || null;
    const mainSlider = mainarea.querySelector('.slider') || null;
    const mainItemsCollect = mainSlider.querySelectorAll('.item') || null;
    
    const preview = gallery.querySelector('.b_photoreport-preview') || null;
    const previewSlider = preview.querySelector('.slider') || null;
    const previewItemsCollect = previewSlider.querySelectorAll('.item') || null;
    
    const info = gallery.querySelector('.b_photoreport-info') || null;
    const picsign = info.querySelector('.picsign') || null;
    const copyright = info.querySelector('.copyright') || null;

    const controlBtns = gallery.querySelectorAll('.b_photoreport-controlbtn') || null;
    
    if(controlBtns){
        controlBtns.forEach(btn => {
            btn.addEventListener('click', btnHolder.bind(btn))
        })
    }

    function slideMove(pos, behavior){
        if(behavior=='instant'){

            mainSlider.scrollLeft = pos;

        } else {

            removeSwipedHint();

            let duration        = 500;
            let timeStart       = null;
            let sliderStartPos  = mainSlider.scrollLeft;

            // используется функция из https://easings.net/ru
            function easing(t){
                // return 1 - Math.pow(1 - t, 4); // easeOutQuart
                return 1 - Math.pow(1 - t, 3); //easeOutCubic
            }

            function animateSliderScroll(timeNow){

                if(!timeStart){
                    timeStart = timeNow;
                }

                let progress = (timeNow-timeStart)/duration;
                    if(progress>1){
                        progress = 1;
                    }

                let k = easing(progress);
                let scrollToPos = sliderStartPos + ((pos - sliderStartPos)*k);

                // mainSlider.scrollTo(scrollToPos, 0);
                mainSlider.scrollLeft = scrollToPos;

                if(progress<1){
                    requestAnimationFrame(animateSliderScroll);
                } else {

                }
            }

            requestAnimationFrame(animateSliderScroll);
        }
    }

    function setCaption(itemNum){

        if(picsign && copyright){
            
            picsign.innerHTML = '';
            copyright.innerHTML = '';

            // let itemImage =  mainItemsCollect[itemNum].querySelector('.item-image') || null;
            
            if(itemImage){
                
                if(itemImage.dataset.caption!=''){
                    picsign.innerHTML = itemImage.dataset.caption;
                }
                if(itemImage.dataset.author!=''){
                    copyright.innerHTML = itemImage.dataset.author;
                }
            }
        }

    }

    setCaption(counter);

}