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
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Add a border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(4)
      .strokeColor("#0056A1")
      .stroke();

    // --- Rounded Logo ---
    const logoPath = "./img/haya.png";
    if (fs.existsSync(logoPath)) {
      doc.save();
      doc.circle(300, 100, 60).clip();
      doc.image(logoPath, 240, 40, { width: 120, height: 120 });
      doc.restore();
    }

    // Title directly under the logo
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#0A2540")
      .text("CERTIFICATE OF MEMBERSHIP", 0, 170, {
        align: "center",
        underline: true,
      });

    doc.moveDown(4);

    doc
      .fontSize(14)
      .fillColor("black")
      .font("Helvetica")
      .text("This is to proudly certify that", { align: "center" });

    doc.moveDown(1);

    // Member’s Name
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#0056A1")
      .text(memberName, { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor("black")
      .font("Helvetica")
      .text(
        `having duly completed the registration requirements, is hereby recognized as a Member of the HEALTH FOR ALL YOUTH ASSOCIATION (HAYA) in good standing, with all the rights, privileges, and responsibilities appertaining thereto. We welcome you into our community of young leaders dedicated to promoting health, youth empowerment, and social impact.`,
        { align: "justify"}
      );

    doc.moveDown(3);

    doc
      .font("Helvetica-Oblique")
      .fillColor("gray")
      .text(
        `"This certificate signifies the commitment of the bearer to the mission and vision of HAYA. Together for youth, together for health."`,
        { align: "center"}
      );

    doc.moveDown(6);

    // Signature lines
    doc
      .font("Helvetica")
      .fillColor("black")
      .text("_________________________", 100, 600)
      .text("_________________________", 400, 600);

    doc
      .fontSize(10)
      .text("President / National Chairman", 100, 620)
      .text("General Secretary", 400, 620);

    // Date and time
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Dated this ${formattedDate} at ${formattedTime}`, 200, 670);

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
