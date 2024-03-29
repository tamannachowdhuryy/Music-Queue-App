document.addEventListener('DOMContentLoaded', function() {
  let header = document.querySelector('header');
  let sections = document.querySelectorAll('section');
  let navLinks = document.querySelectorAll('nav a');

  window.addEventListener('scroll', function() {
    let fromTop = window.scrollY;

    // Add fixed class to header when scrolling down
    if (fromTop > 50) {
      header.classList.add('fixed');
    } else {
      header.classList.remove('fixed');
    }

    // Highlight the current section in the navigation
    sections.forEach(sec => {
      let top = sec.offsetTop - 50;
      let height = sec.offsetHeight;
      let id = sec.getAttribute('id');

      if (fromTop > top && fromTop < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
        });

        document.querySelector('nav a[href*="' + id + '"]')?.classList.add('active');
      }
    });
  });
  refreshClick()
  setInterval(refreshClick, 10000)

});



async function submitSongs() { //run in its own time

  const songInput = document.getElementById("song-insertion");
  const artistInput = document.getElementById("artist-insertion");
  const song = songInput.value || "No Songs"
  const artist = artistInput.value || "No Songs"

  const response = await fetch('http://localhost:8000/songs', {
    method: "POST",
    body: JSON.stringify({
      song,
      artist
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  });
  
  updateOnResponse(response)
  
}

async function refreshClick(){
  const response = await fetch('http://localhost:8000/votes', {
    method: "GET",


  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  });

  updateOnResponse(response)

}

function updateOnResponse(response){
  console.log("Got response from the server: ")
  console.log(response)
  const list = document.createElement("ol");
  response.preferences.forEach(preference => {
    const listItem = document.createElement("li");
    listItem.classList.add('rasberry')
    const title = document.createElement('div')
    title.textContent = preference.song
    title.classList.add('blueberry')
    const upVote = document.createElement("button")
    upVote.classList.add("upVoteButton"); // Apply styling class
    upVote.style.backgroundImage = "url('pictures/like.png')";
    upVote.style.backgroundSize = "50% auto"; // Adjust image scaling as needed
    upVote.onclick = () => {vote(preference.song , true)} //true means upvote
    const thumbsUpCount = document.createElement('div')
    thumbsUpCount.textContent = preference.vote.upvote
    thumbsUpCount.classList.add('blueberry')
    

    const downVote = document.createElement("button")
    downVote.classList.add("downVoteButton"); // Apply styling class
    downVote.style.backgroundImage = "url('pictures/thumb-down.png')";
    downVote.style.backgroundSize = "50% auto"; // Adjust image scaling as needed
    downVote.onclick = () => {vote(preference.song , false)}
    const thumbsDownCount = document.createElement('div')
    thumbsDownCount.textContent = preference.vote.downvote
    thumbsDownCount.classList.add('blueberry')

    
    listItem.appendChild(title)
    listItem.appendChild(upVote)
    listItem.appendChild(thumbsUpCount)
    listItem.appendChild(downVote)
    listItem.appendChild(thumbsDownCount)
    list.appendChild(listItem)
   
  })

    const responseElement = document.getElementById("song-list")
  if (responseElement.children.length) {
    responseElement.replaceChild(list, responseElement.children[0])
  } else {
    responseElement.appendChild(list)
  }
}




async function vote(songName, upVote) {

  const response = await fetch('http://localhost:8000/votes', {
    method: "POST", body: JSON.stringify({
      song: songName, 
      isUpvote: upVote
    }) 
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  })
  updateOnResponse(response)
  
  
  
}