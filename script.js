document.addEventListener("DOMContentLoaded", function () {
  // ✅ Supabase client setup
  const supabaseUrl = "https://radnoxjlhphknteblegk.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhZG5veGpsaHBoa250ZWJsZWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5MjIwMzEsImV4cCI6MjA3MTQ5ODAzMX0.Xj9itMcmyAAOH2bzV420f2D1dity793q0YkRK_85d2Q";
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

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

  // Preview certificate button
  if (previewBtn) {
    previewBtn.addEventListener("click", function () {
      const full_name = document.getElementById("full_name").value;
      if (full_name) {
        document.getElementById("previewName").textContent = full_name;
        const today = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        document.getElementById("previewDate").textContent = today;
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

      // Email validation
      const email = document.getElementById("email").value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorElements.email.classList.remove("hidden");
        document.getElementById("email").classList.add("input-error");
        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // Show loading
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
      };

      // ✅ Save to Supabase
      const { error } = await supabaseClient.from("members").insert([formData]);

      loadingOverlay.classList.add("hidden");

      if (!error) {
        registrationForm.classList.add("hidden");
        successMessage.classList.remove("hidden");
        successMessage.scrollIntoView({ behavior: "smooth" });
      } else {
        alert("Failed to save registration: " + error.message);
      }
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

  // Download certificate as PDF
  if (downloadCertificateBtn) {
    downloadCertificateBtn.addEventListener("click", function () {
      const fullName = document.getElementById("full_name").value.trim();
      if (!fullName) {
        alert("Please enter your full name before downloading the certificate.");
        return;
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // === Border ===
      doc.setLineWidth(2);
      doc.rect(10, 10, 190, 277);

      // === Rounded Logo (top center) ===
      // Draw a circle mask
      doc.setDrawColor(255, 255, 255);
      doc.circle(105, 40, 25, "S");
      doc.addImage("./img/haya.png", "PNG", 80, 15, 50, 50);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("CERTIFICATE OF MEMBERSHIP", 105, 80, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.text("This is to certify that", 105, 95, { align: "center" });

      // Member name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(fullName, 105, 110, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(13);
      doc.text(
        "having duly completed the registration requirements, is hereby recognized as a",
        105,
        125,
        { align: "center", maxWidth: 180 }
      );
      doc.text(
        "Member of the HEALTH FOR ALL YOUTH ASSOCIATION (HAYA) in good standing.",
        105,
        135,
        { align: "center", maxWidth: 180 }
      );

      // Quote
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.text(
        `"Together for youth, together for health."`,
        105,
        155,
        { align: "center" }
      );

      // --- Seal (under the quote, full opacity) ---
      doc.addImage("./img/seal.png", "PNG", 70, 165, 70, 70);

      // === Signature bottom-right ===
      doc.addImage("./img/signature.jpg", "JPG", 130, 230, 60, 25);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("__________________________", 125, 260);
      doc.text("President / National Chairman", 125, 270);

      // === Issued date bottom-left ===
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.setFontSize(12);
      doc.text(`Issued on: ${today}`, 20, 270);

      // Save PDF
      doc.save(`${fullName}_certificate.pdf`);
    });
  }
});
