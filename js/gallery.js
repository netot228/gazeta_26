// props
// let props = {
//     gallery: HTMLElement

// }
function gazetaGallery(props) {

    let limit = props.limit || null;
    let counter = 0;

    const gallery = props.gallery;
    const mainarea = gallery.querySelector('.b_photoreport-mainarea');
    const mainSlider = mainarea.querySelector('.slider');
    const mainItemsCollect = mainSlider.querySelectorAll('.item');
    const preview = gallery.querySelector('.b_photoreport-preview');
    const previewSlider = preview.querySelector('.slider');
    const previewItemsCollect = previewSlider.querySelectorAll('.item');
    const info = gallery.querySelector('.b_photoreport-info');
    const picsign = info.querySelector('.picsign');
    const copyright = info.querySelector('.copyright');

    const controlBtns = gallery.querySelectorAll('.b_photoreport-controlbtn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', btnHolder.bind(btn))
    })


    function btnHolder(e) {
        const btn = this;

        mainItemsCollect[++counter].scrollIntoView(
            { behavior: "smooth", block: "nearest", inline: "nearest" }
        )

        // mainSlider.scrollIntoView(
        //     {behavior: "smooth", block: "center", inline: "start"}
        // )

        // console.log('btn is')
        // console.dir(btn);

        // console.log('and e is')
        // console.debug(e);
    }

}