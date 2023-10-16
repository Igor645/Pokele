const userInput = document.querySelector(".username");
const passInput = document.querySelector(".password");
const regButton = document.querySelector(".confirm")

regButton.addEventListener("click", event => {
    event.preventDefault();
    registerUser();
})


const registerUser = async () => {
    const userDto = {
      username: userInput.value,
      password: passInput.value
    };
  
    try {
        const response = await fetch('http://noobtriestowin-001-site1.ctempurl.com/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDto),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error registering user: ${errorMessage}`);
      }
  
      const userData = await response.json();
      console.log('User registered successfully:', userData);
    } catch (error) {
      console.error('Error:', error);
    }
  };
    