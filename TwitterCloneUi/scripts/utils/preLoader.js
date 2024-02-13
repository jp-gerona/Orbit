const loader = document.querySelector('.loader-section');
const loaderIconWrapper = document.querySelector('.loader-icon-wrapper');
const loaderLogo = document.querySelector('.loader-logo');

history.scrollRestoration = "manual";

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
  
  loader.addEventListener('animationend', handleAnimationEnd);
  loaderIconWrapper.addEventListener('animationend', handleAnimationEnd);
  loaderLogo.addEventListener('animationend', handleAnimationEnd);
});