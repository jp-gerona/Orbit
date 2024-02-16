history.scrollRestoration = "manual";
const loader = document.querySelector('.loader-section');
const loaderIconWrapper = document.querySelector('.loader-icon-wrapper');
const loaderLogo = document.querySelector('.loader-logo');

function removeLoader() {
  loader.remove(); 
}
function handleAnimationEnd() {
  removeLoader();
}

window.addEventListener('load', () => {
  loader.classList.add('fade-out');
  loaderIconWrapper.classList.add('zoom-out');
  loaderLogo.classList.add('zoom-out');
  
  loader.classList.add('loader-hidden');
  loader.addEventListener('transitionend', () => {
    document.body.removeChild(loader);
  });
});