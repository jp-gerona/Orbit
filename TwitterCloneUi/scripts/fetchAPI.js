import likePost from './utils/likeUtils.js';

export async function postCreateUser(formObject) {
    let username = formObject.username;
    let password = formObject.password;
  
    const res = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        window.location.replace("index.html");
        return true;
    } else {
        return false;
    }
}

  export async function postLogIn() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        console.log('successful')
        const userToken = await res.text();
        console.log(`User token: ${userToken}`);
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", username)
        console.log(localStorage)
        window.location.replace("home.html");
    } else {
        console.log('login fails')
    }
  }

export let sendToken = {
  token: localStorage.getItem("token")
};

export let getCurrentUser = {
  username: localStorage.getItem("user")
}

  export async function postCreatePost() {
    var post = document.getElementById("writePost").value;
    let token = localStorage.getItem("token");

    const res = await fetch('http://localhost:3000/api/v1/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": post
        })
    });

    if (res.ok) {
        console.log('successful');
    } else {
        console.log('failed');
    }
}

  
  // export async function postCreatePost() {
  //     var post = document.getElementById('popupInput').value;
  //     let token = localStorage.getItem("token");
    
  //     const res = await fetch('http://localhost:3000/api/v1/posts', {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${token}`
  //         },
  //         body: JSON.stringify({
  //             "content": post
  //         })
  //     })
  //     if(res.ok){
  //         console.log('successful')
  //     } else {
  //         console.log('failed')
  //     }
  // }

  export async function getPosts() {
    let token = localStorage.getItem("token");
  
    try {
      const res = await fetch('http://localhost:3000/api/v1/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
  
      const data = await res.json();
  
      console.log(data); // Log the data to check the structure and content
  
      // Select the posts-feed container
      const postsFeedContainer = document.querySelector(".posts-feed");
  
      // Clear existing posts
      postsFeedContainer.innerHTML = '';
  
      // Loop through each post data
      data.forEach(post => {
        // Create a new post element
        const postCard = createPostElement(post.postedBy, post.postId, post.content, post.timestamp);
  
        // Append the new post element at the beginning of the posts-feed container
        postsFeedContainer.prepend(postCard);
        likePost('.feed-card .like-btn');
      });
  
    } catch (error) {
      console.error('Error occurred while fetching posts:', error);
    }
  }
  
  // Function to create post element
  const createPostElement = (username, postId, postText, timestamp) => {
    const postDiv = document.createElement("div");
    postDiv.className = "feed-card";
    
  
    postDiv.innerHTML = `
      <div class="profile-photo">
        <img src="./images/profile-photo-1.png" alt="Profile Photo">
      </div>
      <div class="post-container">
        <div class="user">
          <h5>${username} <span class="handle muted">@OrbitUser</span></h5>
          <p class="primary">${timestamp}</p>
        </div>
        <div class="post-content">${postText}</div>
        <div class="like-btn">
          <input type="checkbox" class='likeButton' id='${postId}'/>
          <div class="like-btn-content">
            <i class="ri-heart-line"></i>
            <label>Like Post</label>
          </div>
        </div>
      </div>
      <div class="post-logo">
        <i class="ri-chat-smile-2-line"></i>
      </div>
    `;
  
    return postDiv;
  };
  
export async function likePostAPI(postId, isChecked) {
  let token = localStorage.getItem("token");
  const likeAction = isChecked ? "like" : "unlike";
  
  const res = await fetch(`http://localhost:3000/api/v1/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: likeAction
      })
  })
  if(res.ok && likeAction === 'like') {
    console.log("Post Liked")
  } else if (res.ok && likeAction === 'unlike') {
    console.log("Post Unliked")
  }  else {
    console.log("Post Like Failure")
  }
}

  export async function fetchUserList() {
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if(res.ok){
      const userList = await res.json();
      displayUserList(userList)
    }
  }
  
  async function displayUserList(users) {
    const followDiv = document.querySelector('.suggest-follows-card');
    const userName = getCurrentUser.username;

    users.forEach(user => {
      followCheck(userName)
      .then(followerList => {
        for (let u of followerList) {
          if (user === u) {
            const checkbox = document.querySelector(`[data-username="${u}"]`);
            if (checkbox) {
              checkbox.checked = true;
              console.log(u, "is checked");
            }
          }
        }
      })

      if (user !== userName) {
        const userSuggestion = document.createElement("div");
        userSuggestion.className = "follow-container"
        userSuggestion.innerHTML = `<div class="follow-container">
        <div class="profile-container">
          <div class="profile-photo">
            <img src="./images/profile-photo-2.png" alt="Profile Photo">
          </div>
          <div class="handle">
            <h5>`+user+`</h5> 
            <p class="muted">@`+user+`</p> 
          </div>
        </div>

        <div class="btn primary-btn follow-btn">
          <input type="checkbox" class="follow-box" data-username="`+user+`"/>
          <div class="follow-btn-content link-1">
            <label>Follow</label>
          </div>
        </div>        
      </div>`

        followDiv.appendChild(userSuggestion);

        const followButton = document.querySelector('[data-username='+user+']')
        followButton.addEventListener('click', function () {
          const usernameToFollow = this.getAttribute('data-username');

          if (followButton.checked) {
            console.log(`Followed ${usernameToFollow} by ${userName}`);
            followUser(userName,usernameToFollow);
          } else {
            console.log(`Unfollowed ${usernameToFollow} by ${userName}`);
            unfollowUser(userName,usernameToFollow);

          }
        });
      }

    });
    
  }
  
  async function followUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/"+following, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
  }
  
  async function unfollowUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/"+following, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
  }
  
  async function followCheck(user) {
    let token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/v1/users/"+user+"/following/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    let data = await res.json();
    return data;
  }
