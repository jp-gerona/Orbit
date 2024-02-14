export default function followUser(followBtnSelector, isFollowed) {
  const followBtns = document.querySelectorAll(followBtnSelector);

  followBtns.forEach(function(followBtn) {
    const checkbox = followBtn.querySelector('input[type="checkbox"]');
    const label = followBtn.querySelector('.follow-btn-content label');

    checkbox.checked = isFollowed; // Set the initial checked state

    if (isFollowed) {
      followBtn.classList.remove('primary-btn');
      followBtn.classList.add('default-btn');
      label.textContent = 'Unfollow';
    } else {
      followBtn.classList.remove('default-btn');
      followBtn.classList.add('primary-btn');
      label.textContent = 'Follow';
    }

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        followBtn.classList.remove('primary-btn');
        followBtn.classList.add('default-btn');
        label.textContent = 'Unfollow';
      } else {
        followBtn.classList.remove('default-btn');
        followBtn.classList.add('primary-btn');
        label.textContent = 'Follow';
      }
    });
  });
}