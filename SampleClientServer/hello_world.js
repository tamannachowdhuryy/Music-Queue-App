
function main() {
  console.log("HELLO EVERYBODY");
}

async function onSubmit() {
  // Read the input values from the HTML Inputs
  console.log("Clicked Submit");
  const nameInput = document.getElementById("name");
  const cookiesInput = document.getElementById("cookie");
  const name = nameInput.value || "No Name"
  const cookie = cookiesInput.value || "No Cookies"

  // Send the POST request and WAIT for the response.
  const response = await fetch('http://localhost:8000/', {
    method: "POST", body: JSON.stringify({
      name,
      cookie
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not OK');  // Handle non-200 status codes
    }
    return response.json();  // Parse the response as JSON
  })

  // Process the server output back into the HTML
  console.log("Got response from the server: ")
  console.log(response)
  const list = document.createElement("ol");
  response.preferences.forEach(preference => {
    const listItem = document.createElement("li");
    listItem.textContent = preference
    list.appendChild(listItem)
  })

  // Add the new response to the DOM, replacing the old one if present.
  const responseElement = document.getElementById("response")
  if (responseElement.children.length) {
    responseElement.replaceChild(list, responseElement.children[0])
  } else {
    responseElement.appendChild(list)
  }
}

main()