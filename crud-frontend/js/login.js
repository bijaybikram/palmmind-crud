$(document).ready(function () {
  // login handled here
  $("#loginForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      if (response.status === 200) {
        localStorage.setItem("token", token);
        window.location.href = "index.html";
      }
    } catch (error) {
      console.log(error);
    }
  });

  //   forgot password handled here
  $("#forgotPasswordForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgotpassword",
        {
          email,
        }
      );
      window.location.href = "verifyOtp.html";
    } catch (error) {
      console.log(error);
    }
  });

  //   verify otp form handled here
  $("#verifyOtpForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const otp = $("#otp").val();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verifyotp",
        {
          email,
          otp,
        }
      );
      window.location.href = "resetPassword.html";
    } catch (error) {
      console.log(error);
    }
  });

  //   reset password handled here
  $("#resetPasswordForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const newPassword = $("#newPassword").val();
    const confirmNewPassword = $("#confirmPassword").val();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/resetpassword",
        {
          email,
          newPassword,
          confirmNewPassword,
        }
      );
      window.location.href = "login.html";
    } catch (error) {
      console.log(error);
    }
  });
});
