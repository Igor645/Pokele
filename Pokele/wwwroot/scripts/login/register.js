const userInput = document.querySelector(".username");
const passInput = document.querySelector(".password");
const promptError = document.querySelector(".promptError");
let regButton = document.querySelector(".confirm")
const apiUrl = "https://noobtriestowin-001-site1.ctempurl.com/api"

regButton.addEventListener("click", event => {
    regButton.disabled = true;
    event.preventDefault();
    registerUser();
})


const registerUser = async () => {
    const userDto = {
      username: userInput.value,
      password: passInput.value
    };
  
    try {
        const response = await fetch(`${apiUrl}/User`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
  
      if (!response.ok) {
        regButton.disabled = false;
        const errorMessage = await response.text();
        promptError.innerText = errorMessage;
        throw new Error(`Error registering user: ${errorMessage}`);
      }
  
      const userData = await response.json();
      console.log('User registered successfully:', userData);
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error:', error);
    }
  };
    