const userInput = document.querySelector(".username");
const passInput = document.querySelector(".password");
const loginButton = document.querySelector(".confirm")
const promptError = document.querySelector(".promptError");
const apiUrl = "https://noobtriestowin-001-site1.ctempurl.com/api"

loginButton.addEventListener("click", async (event) =>{
    event.preventDefault()
    loginButton.disabled = true;;
    await loginUser()
})

const loginUser = async () => {
  const username = userInput.value;
  const password = passInput.value;

  try {
      const response = await fetch(`${apiUrl}/User/Login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        loginButton.disabled = false;
        const errorMessage = await response.text();
        promptError.innerText = errorMessage;
        throw new Error(`Error logging in: ${errorMessage}`);
      }

      const userData = await response.json();

      const userId = userData.id;

      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('accountName', username);
      sessionStorage.setItem('userId', userId);
      window.location.href = 'index.html';
  } catch (error) {
      console.error('Error:', error);
  }
};

  