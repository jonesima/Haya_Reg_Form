require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// --- Express app setup ---
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- Supabase setup ---
const supabaseUrl = "https://radnoxjlhphknteblegk.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log(
  "Supabase key:",
  supabaseKey ? supabaseKey.substring(0, 10) + "..." : "NOT loaded"
);
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Registration Route: Save to Supabase ---
app.post("/register", async (req, res) => {
  try {
    const { full_name, dob, gender, occupation, email, phone, address, terms } =
      req.body;
    console.log("Received formData:", req.body);

    const { data, error } = await supabase
      .from("members")
      .insert([
        { full_name, dob, gender, occupation, email, phone, address, terms },
      ]);

    console.log("Supabase insert data:", data);
    console.log("Supabase insert error:", error);

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ error: "Failed to save data", details: error });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// --- Certificate Generator ---
function generateCertificate(memberName, filePath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Add border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .strokeColor("#0A2540")
      .stroke();

    // Logo (top center)
    const logoPath = "./img/haya.png";
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 40, 30, { width: 80 });
    }

    // Title
    doc
      .fontSize(26)
      .font("Helvetica-Bold")
      .fillColor("#0A2540")
      .text("CERTIFICATE OF MEMBERSHIP", 0, 130, {
        align: "center",
      });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor("black")
      .font("Helvetica")
      .text("This is to certify that", { align: "center" });

    doc.moveDown(1);

    // Member’s Name
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#0056A1")
      .text(memberName, { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor("black")
      .font("Helvetica")
      .text(
        `having duly completed the registration requirements, is hereby recognized as a Member of the HEALTH FOR ALL YOUTH ASSOCIATION (HAYA) in good standing, with all the rights, privileges, and responsibilities appertaining thereto.`,
        {
          align: "justify",
          indent: 30,
          lineGap: 4,
        }
      );

    doc.moveDown(2);

    doc
      .font("Helvetica-Oblique")
      .fillColor("gray")
      .text(
        `"This certificate signifies the commitment of the bearer to the mission and vision of HAYA. Together for youth, together for health."`,
        {
          align: "center",
          lineGap: 4,
        }
      );

    // --- Seal (watermark style in center) ---
    const sealPath = "./img/seal.png";
    if (fs.existsSync(sealPath)) {
      doc.opacity(0.2);
      doc.image(sealPath, doc.page.width / 2 - 100, 250, { width: 200 });
      doc.opacity(1); // reset opacity
    }

    // --- Signature (President only) ---
    const signaturePath = "./img/signature.jpg";
    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, 100, 580, { width: 120 });
    }

    // Signature line + title
    doc
      .fontSize(12)
      .fillColor("black")
      .text("_________________________", 100, 610)
      .text("ADEFALA ESTHER OMOLARA", 100, 620)
      .text("HAYA President", 100, 630);

    // Date
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Issued on: ${formattedDate}`, 100, 670);

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
}

// --- Certificate Route: Generate and Download PDF ---
app.post("/certificate", async (req, res) => {
  const { fullName } = req.body;
  if (!fullName) return res.status(400).send("Full name is required");

  try {
    const fileName = `certificate_${fullName.replace(/ /g, "_")}.pdf`;
    const filePath = path.join(__dirname, fileName);
    await generateCertificate(fullName, filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    fs.createReadStream(filePath)
      .on("end", () => fs.unlinkSync(filePath)) // Delete after sending
      .pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating certificate");
  }
});

// --- Start server ---
const PORT = 5501;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
