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

async function refreshSongs() {
  console.log('hi')


  const response = await fetch('http://localhost:8000/votes', {
    method: "GET"
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  })
  console.log(response)
}