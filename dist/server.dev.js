"use strict";

require("dotenv").config();

var express = require("express");

var cors = require("cors");

var bodyParser = require("body-parser");

var _require = require("@supabase/supabase-js"),
    createClient = _require.createClient;

var PDFDocument = require("pdfkit");

var fs = require("fs");

var path = require("path"); // --- Express app setup ---


var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); // --- Supabase setup ---

var supabaseUrl = "https://radnoxjlhphknteblegk.supabase.co";
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("Supabase key:", supabaseKey ? supabaseKey.substring(0, 10) + "..." : "NOT loaded");
var supabase = createClient(supabaseUrl, supabaseKey); // --- Registration Route: Save to Supabase ---

app.post("/register", function _callee(req, res) {
  var _req$body, full_name, dob, gender, occupation, email, phone, address, terms, _ref, data, error;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, full_name = _req$body.full_name, dob = _req$body.dob, gender = _req$body.gender, occupation = _req$body.occupation, email = _req$body.email, phone = _req$body.phone, address = _req$body.address, terms = _req$body.terms;
          console.log("Received formData:", req.body);
          _context.next = 5;
          return regeneratorRuntime.awrap(supabase.from("members").insert([{
            full_name: full_name,
            dob: dob,
            gender: gender,
            occupation: occupation,
            email: email,
            phone: phone,
            address: address,
            terms: terms
          }]));

        case 5:
          _ref = _context.sent;
          data = _ref.data;
          error = _ref.error;
          console.log("Supabase insert data:", data);
          console.log("Supabase insert error:", error);

          if (!error) {
            _context.next = 13;
            break;
          }

          console.error("Supabase error:", error);
          return _context.abrupt("return", res.status(500).json({
            error: "Failed to save data",
            details: error
          }));

        case 13:
          res.json({
            success: true,
            data: data
          });
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.error("Unexpected error:", _context.t0);
          res.status(500).json({
            error: "Server error",
            details: _context.t0.message
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
}); // --- Certificate Generator ---

function generateCertificate(memberName, filePath) {
  return new Promise(function (resolve, reject) {
    var doc = new PDFDocument({
      size: "A4",
      margin: 50
    });
    var stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    var now = new Date();
    var formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }); // Add border

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).strokeColor("#0A2540").stroke(); // Logo (top center)

    var logoPath = "./img/haya.png";

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 40, 30, {
        width: 80
      });
    } // Title


    doc.fontSize(26).font("Helvetica-Bold").fillColor("#0A2540").text("CERTIFICATE OF MEMBERSHIP", 0, 130, {
      align: "center"
    });
    doc.moveDown(2);
    doc.fontSize(14).fillColor("black").font("Helvetica").text("This is to certify that", {
      align: "center"
    });
    doc.moveDown(1); // Member’s Name

    doc.fontSize(22).font("Helvetica-Bold").fillColor("#0056A1").text(memberName, {
      align: "center"
    });
    doc.moveDown(1);
    doc.fontSize(12).fillColor("black").font("Helvetica").text("having duly completed the registration requirements, is hereby recognized as a Member of the HEALTH FOR ALL YOUTH ASSOCIATION (HAYA) in good standing, with all the rights, privileges, and responsibilities appertaining thereto.", {
      align: "justify",
      indent: 30,
      lineGap: 4
    });
    doc.moveDown(2);
    doc.font("Helvetica-Oblique").fillColor("gray").text("\"This certificate signifies the commitment of the bearer to the mission and vision of HAYA. Together for youth, together for health.\"", {
      align: "center",
      lineGap: 4
    }); // --- Seal (watermark style in center) ---

    var sealPath = "./img/seal.png";

    if (fs.existsSync(sealPath)) {
      doc.opacity(0.2);
      doc.image(sealPath, doc.page.width / 2 - 100, 250, {
        width: 200
      });
      doc.opacity(1); // reset opacity
    } // --- Signature (President only) ---


    var signaturePath = "./img/signature.jpg";

    if (fs.existsSync(signaturePath)) {
      doc.image(signaturePath, 100, 580, {
        width: 120
      });
    } // Signature line + title


    doc.fontSize(12).fillColor("black").text("_________________________", 100, 610).text("ADEFALA ESTHER OMOLARA", 100, 620).text("HAYA President", 100, 630); // Date

    doc.fontSize(12).fillColor("black").text("Issued on: ".concat(formattedDate), 100, 670);
    doc.end();
    stream.on("finish", function () {
      return resolve(filePath);
    });
    stream.on("error", reject);
  });
} // --- Certificate Route: Generate and Download PDF ---


app.post("/certificate", function _callee2(req, res) {
  var fullName, fileName, filePath;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          fullName = req.body.fullName;

          if (fullName) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).send("Full name is required"));

        case 3:
          _context2.prev = 3;
          fileName = "certificate_".concat(fullName.replace(/ /g, "_"), ".pdf");
          filePath = path.join(__dirname, fileName);
          _context2.next = 8;
          return regeneratorRuntime.awrap(generateCertificate(fullName, filePath));

        case 8:
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "attachment; filename=".concat(fileName));
          fs.createReadStream(filePath).on("end", function () {
            return fs.unlinkSync(filePath);
          }) // Delete after sending
          .pipe(res);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](3);
          console.error(_context2.t0);
          res.status(500).send("Error generating certificate");

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 13]]);
}); // --- Start server ---

var PORT = 5501;
app.listen(PORT, function () {
  console.log("Server running at http://localhost:".concat(PORT));
});