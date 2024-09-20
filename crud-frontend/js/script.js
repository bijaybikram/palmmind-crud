// scripts for home page
$(document).ready(function () {
  // Load Users
  async function loadUsers() {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      const users = response.data.data;

      console.log(response);
      $("#usersTable tbody").empty();
      users.forEach((user) => {
        $("#usersTable tbody").append(`
                 <tr data-email="${user.userEmail}">
                    <td class="row-el">${user.userName}</td>
                    <td class="row-el">${user.userEmail}</td>
                    <td><button id="deleteBtn" class="btn btn-danger delete-btn" data-email="${user.userEmail}">Delete</button></td>
                    <td><button id="changeNameBtn" class="btn btn-danger delete-btn" data-email="${user.userEmail}" data-name="${user.userName}">Change Username</button></td>
                 </tr>
              `);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Show user details in modal
  $("#usersTable").on("click", ".row-el", async function () {
    const email = $(this).closest("tr").data("email");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${email}`
      );
      const userDetails = response.data.data;

      $("#userInfo").html(
        `<strong>Name:</strong> ${userDetails[0].userName}<br>
        <strong>Email:</strong> ${userDetails[0].userEmail}`
      );
      $("#userModal").modal("show");
    } catch (error) {
      console.log(error);
    }
  });

  // delete user on delete btn clickevent
  $("#usersTable").on("click", "#deleteBtn", async function () {
    const email = $(this).data("email");
    await axios.delete(`http://localhost:5000/api/users/deleteuser/${email}`);

    window.location.href = "index.html";
  });

  // newUsername form event
  $("#usersTable").on("click", "#changeNameBtn", async function () {
    window.location.href = "changeName.html";
  });

  loadUsers();

  // change username on changenamebtn click event
  $("#changeUsernameForm").on("submit", async function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const newUsername = $("#newUsername").val();
    try {
      await axios.patch("http://localhost:5000/api/auth/changeusername/", {
        email,
        newUsername,
      });

      window.location.href = "index.html";
    } catch (error) {
      console.log(error);
    }
  });

  // loadUsers(); // Load users on page load
});
