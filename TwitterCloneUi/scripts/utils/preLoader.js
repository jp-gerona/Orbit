const loader = document.querySelector('.loader-section');

window.addEventListener('load', () => {
  loader.classList.add('fade-out');
  loader.addEventListener('animationend', () => {
    loader.remove(); 
  });
});