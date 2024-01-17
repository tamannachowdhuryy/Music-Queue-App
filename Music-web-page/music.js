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

        document.querySelector('nav a[href*="' + id + '"]').classList.add('active');
      }
    });
  });
  // fetch('http://localhost:8000/songs/votes')
  //   .then(response => response.json())
  //   .then(songs => {
  //     const songList = document.getElementById('song-list');
  //     songs.forEach(song => {
  //       const track = createTrackElement(song); // Create a track element
  //       songList.appendChild(track);
  //     });
  //   })
  //   .catch(error => {
  //     console.error('Error fetching songs:', error);
  //     // Display an error message to the user
  //   });
});


async function submitSongs() { //run in its own time

  // Retrieve values from input boxes
  var song1 = document.getElementById('song1').value;
  var song2 = document.getElementById('song2').value;
  var song3 = document.getElementById('song3').value;
  var song4 = document.getElementById('song4').value;
  var song5 = document.getElementById('song5').value;

  console.log('Song 1:', song1);
  console.log('Song 2:', song2);
  console.log('Song 3:', song3);
  console.log('Song 4:', song4);
  console.log('Song 5:', song5);

  const response = await fetch('http://localhost:8000/songs', {
    method: "POST", body: JSON.stringify({
      songNames: [song1, song2, song3, song4, song5],

    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  })


}

// async function refreshSongs() {
//   console.log('hi')


//   const response = await fetch('http://localhost:8000/votes', {
//     method: "GET"
//   }).then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not OK');  // Handle non-200 status codes
//     }
//     return response.json();  // Parse the response as JSON
//   })
//   console.log(response)
// }

async function refreshSongs() {

  console.log('hello');
  try {
     const response = await fetch('http://localhost:8000/votes', {
    method: "GET"
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  })
    const songs = response;
    //Agree: if all songs will be like this -> output the same as ja
    // const songs = [{title:"My Title 1", artist: "Artists Name 1"},
    //               {title:"My Title 2", artist: "Artists Name 2"},
    //               {title:"My Title 3", artist: "Artists Name 3"},
    //               {title:"My Title 4", artist: "Artists Name 4"},
    //               {title:"My Title 5", artist: "Artists Name 5"}];
    const songList = document.getElementById('song-list');
    songList.innerHTML = ''; // Clear existing tracks

    songs.forEach(song => {
      const track = createTrackElement(song);
      songList.appendChild(track);
    });
  } catch (error) {
    console.error('Error refreshing songs:', error);
    // Display an error message to the user
  }
}

// Helper function to create a track element
function createTrackElement(song) {
  // Construct the track element's HTML structure using song data
  // Example:
  const track = document.createElement('track'); // Adjust element type as needed
  track.innerHTML = `
    <h3>${song.title}</h3>
    <p>${song.artist}</p>
    `;
  return track;
}