const userInput = document.querySelector(".username");
const passInput = document.querySelector(".password");
const loginButton = document.querySelector(".confirm")

loginButton.addEventListener("click", async (event) =>{
    event.preventDefault()
    await loginUser();
})

const loginUser = async () => {
  const username = userInput.value;
  const password = passInput.value;

  try {
      const response = await fetch('http://noobtriestowin-001-site1.ctempurl.com/api/User/Login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
          const errorMessage = await response.text();
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

  