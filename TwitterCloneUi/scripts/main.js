import { postCreatePost, getPosts, fetchUserList, sendToken, getCurrentUser, likePostAPI } from './fetchAPI.js';
import followUser from './utils/followUtils.js';

const validateToken = () => {
  console.log(sendToken);
  if(sendToken.token === "" ||  sendToken.token === null) {
    window.location.replace("index.html")
  } else {
    console.log('There is a token');
  }
}

let displayCurrentUserHome = () => {
  let username = getCurrentUser.username;
  let usernameHolder = document.getElementById('username');
  console.log(usernameHolder + '   ' + username)
  usernameHolder.innerText = username;

  let smallUsernameHolder = document.getElementById('@username');
  smallUsernameHolder.innerText = '@'+username.toLowerCase();
}

let displayCurrentUserProfile = () => {
  let username = getCurrentUser.username;
  let usernameprofileHolder = document.getElementById('usernameProfile');
  let smallUsernameProfileHolder = document.getElementById('@usernameProfile');
  
  if (usernameprofileHolder != null && smallUsernameProfileHolder != null) {
    usernameprofileHolder.innerText = username;
  smallUsernameProfileHolder.innerText = '@'+username.toLowerCase();
  } else {
    console.log("Failure due to being in Homepage")
  }
}

const validateForm = (formSelector, writePostSelector, postButtonSelector, callback) => {
  const formGroup = document.querySelector(formSelector);
  const textarea = formGroup.querySelector(writePostSelector);
  const charCount = formGroup.querySelector('.char-count');
  const postButton = document.getElementById(postButtonSelector);

  postButton.disabled = true;

  const updateCharCount = () => {
    const remainingChars = 300 - textarea.value.length;
    charCount.innerHTML = `${remainingChars} / 300 characters <i class="ri-quill-pen-line"></i>`;
  };

  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    updateCharCount();
  });

  textarea.addEventListener('focus', updateCharCount);
  textarea.addEventListener('blur', function() {
    if (this.value.trim() === '') {
        charCount.textContent = '';
    }
  });

  formGroup.addEventListener('keyup', () => {
    if (!textarea.value.trim()) {
      postButton.disabled = true;
    } else {
      postButton.disabled = false;
    }
  });

  formGroup.addEventListener('submit', event => {
    event.preventDefault();

    if (textarea.value.trim()) {
      charCount.textContent = '';
      postButton.disabled = true;
      callback(formGroup, writePostSelector, event);
    }
  });
};

const sendtoAPI = async (formGroup, writePostSelector, event) => {
  const textarea = formGroup.querySelector(writePostSelector);
  const text = textarea.value.trim();

  try {
    console.log(text);
    postCreatePost(writePostSelector);
    getPosts();
    textarea.value = '';
    event.preventDefault();
  } catch (error) {
    console.error('Error occurred while posting:', error);
  }
};

const likeHandler = () => {
  const likeButton = document.querySelector('.posts-feed') // Selects the parent element that contains the like button
  likeButton.addEventListener('change', function(event) {
  
  if (event.target.matches('.likeButton')) {
    
    const postId = event.target.id;
    const isChecked = event.target.checked;

    likePostAPI(postId, isChecked);
  }
});
}

const userLogout = () => {
  let logoutButton = document.querySelector('.menu-item[href="./index.html"]')

  logoutButton.addEventListener('click', event =>  {
    localStorage.clear();
  })
}

export let displayCurrentUser = () => {
  let username = getCurrentUser.username;
  let usernameHolder = document.getElementById('username');
  usernameHolder.innerText = username;
  let handlenameHolder = document.getElementById('handlebar');
  handlenameHolder.innerText = `@${username}`;
}


validateToken();
displayCurrentUserHome();
displayCurrentUserProfile();

validateForm('#JS-createPostModal', '#writePostModal', 'postButtonModal', sendtoAPI);
validateForm('#JS-createPost', '#writePost', 'postButton', sendtoAPI);

document.addEventListener("DOMContentLoaded", getPosts);
likeHandler();
followUser('.follow-btn');

fetchUserList(); //fetch Users upon load
userLogout();