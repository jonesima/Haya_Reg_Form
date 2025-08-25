"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear(); // Form elements

  var form = document.getElementById("memberForm");
  var registrationForm = document.getElementById("registrationForm");
  var successMessage = document.getElementById("successMessage");
  var loadingOverlay = document.getElementById("loadingOverlay");
  var newRegistrationBtn = document.getElementById("newRegistrationBtn");
  var previewBtn = document.getElementById("previewBtn");
  var downloadCertificateBtn = document.getElementById("downloadCertificateBtn");
  var certificateDetails = document.getElementById("certificateDetails"); // Error elements

  var errorElements = {
    full_name: document.getElementById("full_nameError"),
    dob: document.getElementById("dobError"),
    gender: document.getElementById("genderError"),
    occupation: document.getElementById("occupationError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    address: document.getElementById("addressError"),
    terms: document.getElementById("termsError")
  }; // Preview certificate button click

  if (previewBtn) {
    previewBtn.addEventListener("click", function () {
      var full_name = document.getElementById("full_name").value;

      if (full_name) {
        document.getElementById("previewName").textContent = full_name;
        var today = new Date();
        var formattedDate = today.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        document.getElementById("previewDate").textContent = formattedDate;
        certificateDetails.classList.remove("hidden");
      } else {
        alert("Please enter your full name to preview the certificate");
      }
    });
  } // Form submission


  if (form) {
    form.addEventListener("submit", function _callee(e) {
      var isValid, requiredFields, email;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              e.preventDefault(); // Reset errors

              Object.values(errorElements).forEach(function (el) {
                return el.classList.add("hidden");
              }); // Validate form

              isValid = true;
              requiredFields = ["full_name", "dob", "gender", "occupation", "email", "phone", "address", "terms"];
              requiredFields.forEach(function (field) {
                var fieldElement;
                var fieldValue;

                if (field === "gender") {
                  fieldElement = document.querySelector('input[name="gender"]:checked');
                  fieldValue = fieldElement ? fieldElement.value : "";
                } else if (field === "terms") {
                  fieldElement = document.getElementById("terms");
                  fieldValue = fieldElement.checked;
                } else {
                  fieldElement = document.getElementById(field);
                  fieldValue = fieldElement.value.trim();
                }

                if (!fieldValue) {
                  errorElements[field].classList.remove("hidden");

                  if (fieldElement && field !== "gender" && field !== "terms") {
                    fieldElement.classList.add("input-error");
                  }

                  isValid = false;
                } else {
                  if (fieldElement && field !== "gender" && field !== "terms") {
                    fieldElement.classList.remove("input-error");
                  }
                }
              }); // Additional validation for email

              email = document.getElementById("email").value.trim();

              if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errorElements.email.classList.remove("hidden");
                document.getElementById("email").classList.add("input-error");
                isValid = false;
              }

              if (isValid) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return");

            case 9:
              // Show loading overlay
              loadingOverlay.classList.remove("hidden"); // Simulate form submission (in a real app, this would be an API call)

              setTimeout(function () {
                loadingOverlay.classList.add("hidden");
                registrationForm.classList.add("hidden");
                successMessage.classList.remove("hidden"); // Scroll to top of success message

                successMessage.scrollIntoView({
                  behavior: "smooth"
                });
              }, 3000);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  } // New registration button click


  if (newRegistrationBtn) {
    newRegistrationBtn.addEventListener("click", function () {
      successMessage.classList.add("hidden");
      registrationForm.classList.remove("hidden");
      form.reset();
      certificateDetails.classList.add("hidden");
      registrationForm.scrollIntoView({
        behavior: "smooth"
      });
    });
  } // Download certificate button click (POST to backend and trigger download)


  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener("click", function () {
      var fullName = document.getElementById("full_name").value.trim();

      if (!fullName) {
        alert("Please enter your full name before downloading the certificate.");
        return;
      } // Create a form and submit to download the PDF


      var form = document.createElement("form");
      form.method = "POST";
      form.action = "http://localhost:5500/certificate";
      form.target = "_blank"; // Optional: open in new tab

      form.style.display = "none";
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = "fullName";
      input.value = fullName;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    });
  }
});