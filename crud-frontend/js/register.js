$(document).ready(function () {
  $("#registrationForm").on("submit", async function (e) {
    e.preventDefault();
    const name = $("#name").val();
    const email = $("#email").val();
    const password = $("#password").val();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          userName: name,
          email,
          password,
        }
      );
      if (response.status === 201) {
        window.location.href = "login.html"; // This should redirect to login page
      }
    } catch (error) {
      console.log(error);
    }
  });
});
