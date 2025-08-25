document.addEventListener("DOMContentLoaded", function () {
  // Set current year in footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Form elements
  const form = document.getElementById("memberForm");
  const registrationForm = document.getElementById("registrationForm");
  const successMessage = document.getElementById("successMessage");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const newRegistrationBtn = document.getElementById("newRegistrationBtn");
  const previewBtn = document.getElementById("previewBtn");
  const downloadCertificateBtn = document.getElementById("downloadCertificateBtn");
  const certificateDetails = document.getElementById("certificateDetails");

  // Error elements
  const errorElements = {
    full_name: document.getElementById("full_nameError"),
    dob: document.getElementById("dobError"),
    gender: document.getElementById("genderError"),
    occupation: document.getElementById("occupationError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    address: document.getElementById("addressError"),
    terms: document.getElementById("termsError"),
  };

  // Preview certificate button click
  if (previewBtn) {
    previewBtn.addEventListener("click", function () {
      const full_name = document.getElementById("full_name").value;
      if (full_name) {
        document.getElementById("previewName").textContent = full_name;
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        document.getElementById("previewDate").textContent = formattedDate;
        certificateDetails.classList.remove("hidden");
      } else {
        alert("Please enter your full name to preview the certificate");
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Reset errors
      Object.values(errorElements).forEach((el) => el.classList.add("hidden"));

      // Validate form
      let isValid = true;
      const requiredFields = [
        "full_name",
        "dob",
        "gender",
        "occupation",
        "email",
        "phone",
        "address",
        "terms",
      ];

      requiredFields.forEach((field) => {
        let fieldElement;
        let fieldValue;

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
      });

      // Additional validation for email
      const email = document.getElementById("email").value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElements.email.classList.remove("hidden");
        document.getElementById("email").classList.add("input-error");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Show loading overlay before sending request
      loadingOverlay.classList.remove("hidden");

      const formData = {
        full_name: document.getElementById("full_name").value.trim(),
        dob: document.getElementById("dob").value,
        gender:
          document.querySelector('input[name="gender"]:checked')?.value || "",
        occupation: document.getElementById("occupation").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        terms: document.getElementById("terms").checked,
      };

      fetch("http://localhost:5500/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((result) => {
          loadingOverlay.classList.add("hidden");
          if (result.success) {
            registrationForm.classList.add("hidden");
            successMessage.classList.remove("hidden");
            successMessage.scrollIntoView({ behavior: "smooth" });
          } else {
            alert("Failed to save registration. Please try again.");
          }
        })
        .catch(() => {
          loadingOverlay.classList.add("hidden");
          alert("Failed to save registration. Please try again.");
        });
    });
  }

  // New registration button click
  if (newRegistrationBtn) {
    newRegistrationBtn.addEventListener("click", function () {
      successMessage.classList.add("hidden");
      registrationForm.classList.remove("hidden");
      form.reset();
      certificateDetails.classList.add("hidden");
      registrationForm.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Download certificate button click (POST to backend and trigger download)
  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener("click", function () {
      const fullName = document.getElementById("full_name").value.trim();
      if (!fullName) {
        alert(
          "Please enter your full name before downloading the certificate."
        );
        return;
      }

      // Create a form and submit to download the PDF
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "http://localhost:5500/certificate";
      form.target = "_blank"; // Optional: open in new tab
      form.style.display = "none";

      const input = document.createElement("input");
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