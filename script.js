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
    state: document.getElementById("stateError"),
    lga: document.getElementById("lgaError"),
    terms: document.getElementById("termsError"),
  };

  // === Nigerian States and LGAs (complete list of 36 states + FCT) ===
  const statesAndLGAs = {
    "Abia": ["Aba North","Aba South","Arochukwu","Bende","Ikwuano","Isiala Ngwa North","Isiala Ngwa South","Isuikwuato","Nthong/Obingwa","Ohafia","Osisioma","Ugwunagbo","Umunneochi","Umuahia North","Umuahia South"],
    "Adamawa": ["Demsa","Fufore","Ganye","Gombi","Guyuk","Hong","Jada","Lamurde","Madagali","Maiha","Mayo-Belwa","Michika","Mubi North","Mubi South","Numan","Shelleng","Song","Toungo","Yola North","Yola South"],
    "Akwa Ibom": ["Abak","Eastern Obolo","Eket","Esit Eket","Essien Udim","Etim Ekpo","Etinan","Ibeno","Ibesikpo Asutan","Ibiono Ibom","Ika","Ikono","Ikot Abasi","Ikot Ekpene","Ini","Itu","Mbo","Mkpat-Enin","Nsit-Atai","Nsit-Ibom","Nsit-Ubium","Obot Akara","Okobo","Onna","Oron","Oruk Anam","Ukanafun","Udung-Uko","Uruan","Urue-Offong/Oruko","Uyo"],
    "Anambra": ["Aguata","Anambra East","Anambra West","Anaocha","Awka North","Awka South","Ayamelum","Dunukofia","Ekwusigo","Idemili North","Idemili South","Ihiala","Njikoka","Nnewi North","Nnewi South","Ogbaru","Onitsha North","Onitsha South","Orumba North","Orumba South","Oyi"],
    "Bauchi": ["Alkaleri","Bauchi","Bogoro","Damban","Darazo","Dass","Gamawa","Ganjuwa","Giade","Itas/Gadau","Jama'are","Katagum","Kirfi","Misau","Ningi","Shira","Tafawa Balewa","Toro","Warji","Zaki"],
    "Bayelsa": ["Brass","Ekeremor","Kolokuma/Opokuma","Nembe","Ogbia","Sagbama","Southern Ijaw","Yenagoa"],
    "Benue": ["Ado","Agatu","Apa","Buruku","Gboko","Guma","Gwer East","Gwer West","Katsina-Ala","Konshisha","Kwande","Logo","Makurdi","Obi","Ogbadibo","Ohimini","Oju","Okpokwu","Otukpo","Tarka","Ukum","Ushongo","Vandeikya"],
    "Borno": ["Abadam","Askira/Uba","Bama","Bayo","Biu","Chibok","Damboa","Dikwa","Gubio","Guzamala","Gwoza","Hawul","Jere","Kaga","Kala/Balge","Konduga","Kukawa","Kwaya Kusar","Mafa","Magumeri","Maiduguri","Marte","Mobbar","Monguno","Ngala","Nganzai","Shani"],
    "Cross River": ["Abi","Akamkpa","Akpabuyo","Bakassi","Bekwarra","Biase","Boki","Calabar Municipal","Calabar South","Etung","Ikom","Obanliku","Obubra","Obudu","Odukpani","Ogoja","Yakuur","Yala"],
    "Delta": ["Aniocha North","Aniocha South","Bomadi","Burutu","Ethiope East","Ethiope West","Ika North East","Ika South","Isoko North","Isoko South","Ndokwa East","Ndokwa West","Okpe","Oshimili North","Oshimili South","Patani","Sapele","Udu","Ughelli North","Ughelli South","Ukwuani","Uvwie","Warri North","Warri South","Warri South West"],
    "Ebonyi": ["Abakaliki","Afikpo North","Afikpo South","Ebonyi","Ezza North","Ezza South","Ikwo","Ishielu","Ivo","Izzi","Ohaozara","Ohaukwu","Onicha"],
    "Edo": ["Akoko-Edo","Egor","Esan Central","Esan North-East","Esan South-East","Esan West","Etsako Central","Etsako East","Etsako West","Igueben","Ikpoba-Okha","Oredo","Orhionmwon","Ovia North-East","Ovia South-West","Owan East","Owan West","Uhunmwonde"],
    "Ekiti": ["Ado-Ekiti","Efon","Ekiti East","Ekiti South-West","Ekiti West","Emure","Gbonyin","Ido-Osi","Ijero","Ikere","Ikole","Ilejemeje","Irepodun/Ifelodun","Ise/Orun","Moba","Oye"],
    "Enugu": ["Awgu","Aninri","Enugu East","Enugu North","Enugu South","Ezeagu","Igbo Etiti","Igbo Eze North","Igbo Eze South","Isi Uzo","Nkanu East","Nkanu West","Nsukka","Oji River","Udenu","Udi","Uzo-Uwani"],
    "FCT": ["Abaji","Bwari","Gwagwalada","Kuje","Kwali","Municipal Area Council"],
    "Gombe": ["Akko","Balanga","Billiri","Dukku","Funakaye","Gombe","Kaltungo","Kwami","Nafada/Bajoga","Shongom","Yamaltu/Deba"],
    "Imo": ["Aboh Mbaise","Ahiazu Mbaise","Ehime Mbano","Ezinihitte","Ideato North","Ideato South","Ihitte/Uboma","Ikeduru","Isiala Mbano","Isu","Mbaitoli","Ngor Okpala","Njaba","Nkwerre","Nwangele","Obowo","Oguta","Ohaji/Egbema","Okigwe","Orlu","Orsu","Oru East","Oru West","Owerri Municipal","Owerri North","Owerri West"],
    "Jigawa": ["Auyo","Babura","Biriniwa","Birnin Kudu","Buji","Dutse","Gagarawa","Garki","Gumel","Guri","Gwaram","Gwiwa","Hadejia","Jahun","Kafin Hausa","Kaugama","Kazaure","Kiri Kasama","Kiyawa","Maigatari","Malam Madori","Miga","Ringim","Roni","Sule Tankarkar","Taura","Yankwashi"],
    "Kaduna": ["Birnin Gwari","Chikun","Giwa","Igabi","Ikara","Jaba","Jema'a","Kachia","Kajuru","Kaduna North","Kaduna South","Kagarko","Kaura","Kauru","Kubau","Kudan","Lere","Makarfi","Sabon Gari","Sanga","Soba","Zangon Kataf","Zaria"],
    "Kano": ["Ajingi","Albasu","Bagwai","Bebeji","Bichi","Bunkure","Dala","Dambatta","Dawakin Kudu","Dawakin Tofa","Doguwa","Fagge","Gabasawa","Garko","Garun Mallam","Gaya","Gezawa","Gwale","Gwarzo","Kabo","Kano Municipal","Karaye","Kibiya","Kiru","Kumbotso","Kunchi","Kura","Madobi","Makoda","Minjibir","Nasarawa","Rano","Rimin Gado","Rogo","Shanono","Sumaila","Takai","Tarauni","Tofa","Tsanyawa","Tudun Wada","Ungogo","Warawa","Wudil"],
    "Katsina": ["Bakori","Batagarawa","Batsari","Baure","Bindawa","Charanchi","Dan Musa","Dandume","Danja","Daura","Dutsi","Dutsin Ma","Faskari","Funtua","Ingawa","Jibia","Kafur","Kaita","Kankara","Kankia","Katsina","Kurfi","Kusada","Mai'Adua","Malumfashi","Mani","Mashi","Matazu","Musawa","Rimi","Sabuwa","Safana","Sandamu","Zango"],
    "Kebbi": ["Aleiro","Arewa Dandi","Argungu","Augie","Bagudo","Birnin Kebbi","Bunza","Dandi","Fakai","Gwandu","Jega","Kalgo","Koko/Besse","Maiyama","Ngaski","Sakaba","Shanga","Suru","Wasagu/Danko","Yauri","Zuru"],
    "Kogi": ["Adavi","Ajaokuta","Ankpa","Bassa","Dekina","Ibaji","Idah","Igalamela-Odolu","Ijumu","Kabba/Bunu","Kogi","Lokoja","Mopa-Muro","Ofu","Ogori/Magongo","Okehi","Okene","Olamaboro","Omala","Yagba East","Yagba West"],
    "Kwara": ["Asa","Baruten","Edu","Ekiti","Ifelodun","Ilorin East","Ilorin South","Ilorin West","Irepodun","Isin","Kaiama","Moro","Offa","Oke Ero","Oyun","Pategi"],
    "Lagos": ["Agege","Ajeromi-Ifelodun","Alimosho","Amuwo-Odofin","Apapa","Badagry","Epe","Eti-Osa","Ibeju-Lekki","Ifako-Ijaiye","Ikeja","Ikorodu","Kosofe","Lagos Island","Lagos Mainland","Mushin","Ojo","Oshodi-Isolo","Shomolu","Surulere"],
    "Nasarawa": ["Akwanga","Awe","Doma","Karu","Keana","Keffi","Kokona","Lafia","Nassarawa","Nassaraawa Egon","Obi","Toto","Wamba"],
    "Niger": ["Agaie","Agwara","Bida","Borgu","Bosso","Chanchaga","Edati","Gbako","Gurara","Katcha","Kontagora","Lapai","Lavun","Magama","Mariga","Mashegu","Mokwa","Moya","Paikoro","Rafi","Rijau","Shiroro","Suleja","Tafa","Wushishi"],
    "Ogun": ["Abeokuta North","Abeokuta South","Ado-Odo/Ota","Ewekoro","Ifo","Ijebu East","Ijebu North","Ijebu North East","Ijebu Ode","Ikenne","Imeko-Afon","Ipokia","Obafemi-Owode","Odeda","Odogbolu","Ogun Waterside","Remo North","Sagamu"],
    "Ondo": ["Akoko North-East","Akoko North-West","Akoko South-East","Akoko South-West","Akure North","Akure South","Ese Odo","Idanre","Ifedore","Ilaje","Ile Oluji/Okeigbo","Irele","Odigbo","Okitipupa","Ondo East","Ondo West","Ose","Owo"],
    "Osun": ["Atakunmosa East","Atakunmosa West","Aiyedaade","Aiyedire","Boluwaduro","Boripe","Ede North","Ede South","Ife Central","Ife East","Ife North","Ife South","Egbedore","Ejigbo","Ifedayo","Ifelodun","Ila","Ilesa East","Ilesa West","Irepodun","Irewole","Isokan","Iwo","Obokun","Odo Otin","Ola Oluwa","Olorunda","Oriade","Orolu","Osogbo"],
    "Oyo": ["Afijio","Akinyele","Atiba","Atisbo","Egbeda","Ibadan North","Ibadan North-East","Ibadan North-West","Ibadan South-East","Ibadan South-West","Ibarapa Central","Ibarapa East","Ibarapa North","Ido","Irepo","Iseyin","Itesiwaju","Iwajowa","Kajola","Lagelu","Ogbomosho North","Ogbomosho South","Ogo Oluwa","Olorunsogo","Oluyole","Ona Ara","Orelope","Ori Ire","Oyo East","Oyo West","Saki East","Saki West","Surulere"],
    "Plateau": ["Barkin Ladi","Bassa","Bokkos","Jos East","Jos North","Jos South","Kanam","Kanke","Langtang North","Langtang South","Mangu","Mikang","Pankshin","Qua'an Pan","Riyom","Shendam","Wase"],
    "Rivers": ["Abua/Odual","Ahoada East","Ahoada West","Akuku-Toru","Andoni","Asari-Toru","Bonny","Degema","Emohua","Eleme","Etche","Gokana","Ikwerre","Khana","Obio/Akpor","Ogba/Egbema/Ndoni","Ogu/Bolo","Okrika","Omuma","Opobo/Nkoro","Oyigbo","Port Harcourt","Tai"],
    "Sokoto": ["Binji","Bodinga","Dange Shuni","Gada","Goronyo","Gudu","Gwadabawa","Illela","Kebbe","Kware","Rabah","Sabon Birni","Shagari","Silame","Sokoto North","Sokoto South","Tambuwal","Tangaza","Tureta","Wamako","Wurno","Yabo"],
    "Taraba": ["Ardo Kola","Bali","Donga","Gashaka","Gassol","Ibi","Jalingo","Karim Lamido","Kumi","Lau","Sardauna","Takum","Ussa","Wukari","Yorro","Zing"],
    "Yobe": ["Bade","Bursari","Damaturu","Fika","Fune","Geidam","Gujba","Gulani","Jakusko","Karasuwa","Machina","Nangere","Nguru","Potiskum","Tarmuwa","Yunusari","Yusufari"],
    "Zamfara": ["Anka","Bakura","Birnin Magaji/Kiyaw","Bukkuyum","Bungudu","Gummi","Gusau","Kaura Namoda","Maradun","Maru","Shinkafi","Talata Mafara","Chafe","Zurmi"]
  };

  // DOM selects
  const stateSelect = document.getElementById("state");
  const lgaSelect = document.getElementById("lga");

  // Populate state dropdown
  if (stateSelect) {
    Object.keys(statesAndLGAs).forEach((state) => {
      const option = document.createElement("option");
      option.value = state;
      option.textContent = state;
      stateSelect.appendChild(option);
    });
  }

  // Fill LGAs when a state is selected
  if (stateSelect && lgaSelect) {
    stateSelect.addEventListener("change", function () {
      lgaSelect.innerHTML = '<option value="">-- Select Local Government --</option>';
      const selectedState = stateSelect.value;
      if (statesAndLGAs[selectedState]) {
        statesAndLGAs[selectedState].forEach((lga) => {
          const option = document.createElement("option");
          option.value = lga;
          option.textContent = lga;
          lgaSelect.appendChild(option);
        });
      }
    });
  }

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
        "state",
        "lga",
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
          fieldValue = fieldElement ? fieldElement.value.trim() : "";
        }

        if (!fieldValue) {
          if (errorElements[field]) errorElements[field].classList.remove("hidden");
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
        state: document.getElementById("state").value.trim(),
        lga: document.getElementById("lga").value.trim(),
      };

      // ✅ Save to Supabase
      try {
        const { error } = await supabaseClient.from("members").insert([formData]);

        loadingOverlay.classList.add("hidden");

        if (!error) {
          registrationForm.classList.add("hidden");
          successMessage.classList.remove("hidden");
          successMessage.scrollIntoView({ behavior: "smooth" });
        } else {
          alert("Failed to save registration: " + error.message);
        }
      } catch (err) {
        loadingOverlay.classList.add("hidden");
        alert("Failed to save registration: " + err.message);
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
      // reset LGAs
      if (lgaSelect) lgaSelect.innerHTML = '<option value="">-- Select Local Government --</option>';
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
        `"Together we build bridges of Hope"`,
        105,
        155,
        { align: "center" }
      );

      // --- Seal (under the quote, full opacity) ---
      try {
        doc.addImage("./img/seal.png", "PNG", 70, 165, 70, 70);
      } catch (err) {
        // ignore image errors
      }

      // === Signature bottom-right ===
      try {
        doc.addImage("./img/signature.jpg", "JPG", 130, 230, 60, 25);
      } catch (err) {
        // ignore image errors
      }
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

  // set current year in footer if present
  const currentYearEl = document.getElementById("currentYear");
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
});
