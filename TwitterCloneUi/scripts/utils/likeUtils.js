export default function likePost(likeBtnSelector) {
  const likeBtns = document.querySelectorAll(likeBtnSelector);

  likeBtns.forEach(function(likeBtn) {
    const checkbox = likeBtn.querySelector('input[type="checkbox"]');
    const heartIcon = likeBtn.querySelector('.like-btn-content i');
    const label = likeBtn.querySelector('.like-btn-content label');

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        likeBtn.classList.add('like-effect');

        heartIcon.classList.remove('ri-heart-line');
        heartIcon.classList.add('ri-heart-fill');
        label.textContent = 'Unlike Post';
      } else {
        likeBtn.classList.add('like-effect');

        heartIcon.classList.remove('ri-heart-fill');
        heartIcon.classList.add('ri-heart-line');
        label.textContent = 'Like Post';
      }
    });

    likeBtn.addEventListener('animationend', function() {
      likeBtn.classList.remove('like-effect');
    });
  });
}