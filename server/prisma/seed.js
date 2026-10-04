const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const prisma = new PrismaClient();

const ALL_PERMISSIONS = [
  "listHome", "readHome",
  "listPatient", "readPatient", "addPatient", "editPatient", "deletePatient",
  "listAppointment", "readAppointment", "addAppointment", "editAppointment", "deleteAppointment",
  "listDoctor", "readDoctor", "addDoctor", "editDoctor", "deleteDoctor",
  "listEmployee", "readEmployee", "addEmployee", "editEmployee", "deleteEmployee",
  "listInvoice", "readInvoice", "addInvoice", "editInvoice", "deleteInvoice",
  "listPackage", "readPackage", "addPackage", "editPackage", "deletePackage",
  "listMedicine", "readMedicine", "addMedicine", "editMedicine", "deleteMedicine",
  "listNote", "readNote", "addNote", "editNote", "deleteNote",
  "listClinicProfile", "readClinicProfile", "editClinicProfile", "readClinic", "editClinic",
  "listProfile", "readProfile", "editProfile",
  "listReport", "readReport"
];

async function main() {
  console.log("🌱 Starting DocDesk database seeding...");

  // 1. Create or Find Clinic
  let clinic = await prisma.clinic.findFirst();
  if (!clinic) {
    clinic = await prisma.clinic.create({
      data: {
        name: "DocDesk Multi-Specialty Hospital & Clinic",
        number: "REG-MH-2024-88912",
        registration_date: "2024-01-15",
        gst_number: "27AABCS1429B1Z8",
        phone: "+91 98765 43210",
        email: "admin@docdesk.health",
        address_line1: "Suite 402, Apex Medical Tower",
        address_line2: "Linking Road, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        zipcode: "400050",
        logo_url: "/uploads/clinic-logo.png",
        favicon_url: "/uploads/clinic-favicon.png",
        scanner_url: "/uploads/clinic-scanner.png",
      },
    });
  }

  // 2. Create Users (Admin & Doctor)
  const hashedPassword = await bcrypt.hash("Demo@1234", 10);

  const adminEmail = "admin@docdesk.demo";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        clinic_id: clinic.id,
        email: adminEmail,
        password: hashedPassword,
        first_name: "Shekhar",
        last_name: "Bhadre",
        mobile: "+91 9876543210",
        role: "ADMIN",
        date_of_birth: "1995-08-18",
        gender: "MALE",
        address_line1: "Bandra West",
        city: "Mumbai",
        zipcode: "400050",
        permissions: JSON.stringify(ALL_PERMISSIONS),
      },
    });
  }

  // Also create alias admin@docto.demo for backward compatibility
  const doctoAdmin = await prisma.user.findUnique({ where: { email: "admin@docto.demo" } });
  if (!doctoAdmin) {
    await prisma.user.create({
      data: {
        clinic_id: clinic.id,
        email: "admin@docto.demo",
        password: hashedPassword,
        first_name: "Demo",
        last_name: "Admin",
        mobile: "+91 9876543210",
        role: "ADMIN",
        date_of_birth: "1994-01-01",
        gender: "MALE",
        address_line1: "Marine Lines",
        city: "Mumbai",
        zipcode: "400020",
        permissions: JSON.stringify(ALL_PERMISSIONS),
      },
    });
  }

  // Create Attending Physician / Doctor Demo User
  const doctorEmail = "doctor@docdesk.demo";
  let doctorUser = await prisma.user.findUnique({ where: { email: doctorEmail } });
  if (!doctorUser) {
    doctorUser = await prisma.user.create({
      data: {
        clinic_id: clinic.id,
        email: doctorEmail,
        password: hashedPassword,
        first_name: "Dr. Aarav",
        last_name: "Mehta",
        mobile: "+91 98234 11223",
        role: "DOCTOR",
        date_of_birth: "1986-05-14",
        gender: "MALE",
        address_line1: "Fort",
        city: "Mumbai",
        zipcode: "400001",
        permissions: JSON.stringify([
          "listHome", "readHome",
          "listPatient", "readPatient", "editPatient",
          "listAppointment", "readAppointment", "addAppointment", "editAppointment",
          "listDoctor", "readDoctor",
          "listMedicine", "readMedicine",
          "listNote", "readNote", "addNote", "editNote",
          "listProfile", "readProfile", "editProfile",
          "listReport", "readReport"
        ]),
      },
    });
  }

  // Doctor alias for backward compatibility
  const doctoDoctor = await prisma.user.findUnique({ where: { email: "doctor@docto.demo" } });
  if (!doctoDoctor) {
    await prisma.user.create({
      data: {
        clinic_id: clinic.id,
        email: "doctor@docto.demo",
        password: hashedPassword,
        first_name: "Dr. Aarav",
        last_name: "Mehta",
        mobile: "+91 98234 11223",
        role: "DOCTOR",
        date_of_birth: "1986-05-14",
        gender: "MALE",
        address_line1: "Fort",
        city: "Mumbai",
        zipcode: "400001",
        permissions: JSON.stringify([
          "listHome", "readHome",
          "listPatient", "readPatient", "editPatient",
          "listAppointment", "readAppointment", "addAppointment", "editAppointment",
          "listDoctor", "readDoctor",
          "listMedicine", "readMedicine",
          "listNote", "readNote", "addNote", "editNote",
          "listProfile", "readProfile", "editProfile",
          "listReport", "readReport"
        ]),
      },
    });
  }

  // 3. Create Doctors
  const doctorData = [
    {
      first_name: "Aarav",
      last_name: "Mehta",
      email: "aarav.mehta@docdesk.health",
      mobile: "+91 99999 10001",
      specialization: "Cardiologist",
      qualification: "MBBS, MD (Cardiology)",
      experience: "14 Years",
      address_line1: "Fort",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400001",
      user_id: doctorUser?.id,
    },
    {
      first_name: "Pooja",
      last_name: "Sharma",
      email: "pooja.sharma@docdesk.health",
      mobile: "+91 99999 10002",
      specialization: "Pediatrician",
      qualification: "MBBS, DCH",
      experience: "9 Years",
      address_line1: "Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400053",
    },
    {
      first_name: "Vikram",
      last_name: "Deshmukh",
      email: "vikram.d@docdesk.health",
      mobile: "+91 99999 10003",
      specialization: "Orthopedic Surgeon",
      qualification: "MBBS, MS (Ortho), Fellowship (Joint Replacement)",
      experience: "16 Years",
      address_line1: "Dadar",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400014",
    },
    {
      first_name: "Ananya",
      last_name: "Iyer",
      email: "ananya.iyer@docdesk.health",
      mobile: "+91 99999 10004",
      specialization: "Dermatologist",
      qualification: "MBBS, MD (Dermatology)",
      experience: "8 Years",
      address_line1: "Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400049",
    },
    {
      first_name: "Rohan",
      last_name: "Kulkarni",
      email: "rohan.k@docdesk.health",
      mobile: "+91 99999 10005",
      specialization: "General Physician",
      qualification: "MBBS, MD (Internal Medicine)",
      experience: "11 Years",
      address_line1: "Powai",
      city: "Mumbai",
      state: "Maharashtra",
      zipcode: "400076",
    },
  ];

  for (const d of doctorData) {
    const existing = await prisma.doctor.findFirst({ where: { email: d.email } });
    if (!existing) {
      await prisma.doctor.create({
        data: {
          clinic_id: clinic.id,
          ...d,
        },
      });
    } else if (d.user_id && !existing.user_id) {
      await prisma.doctor.update({
        where: { id: existing.id },
        data: { user_id: d.user_id },
      });
    }
  }

  // 4. Create Packages
  const packagesData = [
    { name: "Executive Annual Wellness", amount: 4500, seating_count: 6, available_count: 5, description: "Full cardiac, lipid, diabetic checkup & 6 consultations" },
    { name: "Physiotherapy Rehabilitation", amount: 6000, seating_count: 10, available_count: 8, description: "10 guided physical therapy & posture alignment sessions" },
    { name: "Maternal & Child Care Suite", amount: 8500, seating_count: 12, available_count: 10, description: "Comprehensive prenatal & post-natal consultations" },
    { name: "Senior Citizen Care Plan", amount: 3500, seating_count: 4, available_count: 3, description: "Geriatric consultations, home delivery coordination, priority booking" },
  ];

  for (const p of packagesData) {
    const existing = await prisma.package.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.package.create({
        data: {
          clinic_id: clinic.id,
          ...p,
        },
      });
    }
  }

  const allPackages = await prisma.package.findMany({ where: { clinic_id: clinic.id } });

  // 5. Create Employees
  const employeeData = [
    { first_name: "Sunita", last_name: "Patil", email: "sunita@docdesk.health", mobile: "+91 99999 20001", designation: "Head Nurse", department: "ICU & Nursing", date_of_joining: "2023-03-01", city: "Mumbai" },
    { first_name: "Amit", last_name: "Jadhav", email: "amit@docdesk.health", mobile: "+91 99999 20002", designation: "Pharmacist", department: "Pharmacy", date_of_joining: "2023-06-15", city: "Mumbai" },
    { first_name: "Neha", last_name: "Chopra", email: "neha@docdesk.health", mobile: "+91 99999 20003", designation: "Receptionist", department: "Front Desk & Billing", date_of_joining: "2024-01-10", city: "Mumbai" },
  ];

  for (const emp of employeeData) {
    const existing = await prisma.employee.findFirst({ where: { email: emp.email } });
    if (!existing) {
      await prisma.employee.create({
        data: {
          clinic_id: clinic.id,
          ...emp,
        },
      });
    }
  }

  // 6. Create Patients
  const patientData = [
    { name: "Rajesh Malhotra", mobile: "+91 99999 00001", email: "rajesh.m@gmail.com", gender: "MALE", date_of_birth: "1982-04-12", city: "Mumbai", line1: "Colaba Causeway" },
    { name: "Sneha Kapoor", mobile: "+91 99999 00002", email: "sneha.k@gmail.com", gender: "FEMALE", date_of_birth: "1993-11-28", city: "Thane", line1: "Ghodbunder Road" },
    { name: "Kunal Singhania", mobile: "+91 99999 00003", email: "kunal.s@gmail.com", gender: "MALE", date_of_birth: "1978-07-05", city: "Mumbai", line1: "Worli Sea Face" },
    { name: "Priya Nair", mobile: "+91 99999 00004", email: "priya.n@gmail.com", gender: "FEMALE", date_of_birth: "1988-09-19", city: "Navi Mumbai", line1: "Vashi Sector 17" },
    { name: "Deepak Joshi", mobile: "+91 99999 00005", email: "deepak.j@gmail.com", gender: "MALE", date_of_birth: "1965-02-14", city: "Pune", line1: "Kalyani Nagar" },
    { name: "Meera Sen", mobile: "+91 99999 00006", email: "meera.sen@gmail.com", gender: "FEMALE", date_of_birth: "1997-12-03", city: "Mumbai", line1: "Santacruz East" },
    { name: "Arjun Rampal", mobile: "+91 99999 00007", email: "arjun.r@gmail.com", gender: "MALE", date_of_birth: "1985-06-22", city: "Mumbai", line1: "Bandra Kurla Complex" },
    { name: "Kavita Rao", mobile: "+91 99999 00008", email: "kavita.rao@gmail.com", gender: "FEMALE", date_of_birth: "1972-10-30", city: "Mumbai", line1: "Lokhandwala Complex" },
  ];

  for (let i = 0; i < patientData.length; i++) {
    const p = patientData[i];
    const existing = await prisma.patient.findFirst({ where: { mobile: p.mobile } });
    if (!existing) {
      await prisma.patient.create({
        data: {
          clinic_id: clinic.id,
          name: p.name,
          mobile: p.mobile,
          email: p.email,
          gender: p.gender,
          date_of_birth: p.date_of_birth,
          registration_date: moment().subtract(i * 3, "days").format("YYYY-MM-DD"),
          address_line1: p.line1,
          city: p.city,
          state: "Maharashtra",
          zipcode: "400001",
          package_id: allPackages[i % allPackages.length]?.id,
          status: "Active",
          is_expiring_soon: i === 2,
        },
      });
    }
  }

  const allPatients = await prisma.patient.findMany({ where: { clinic_id: clinic.id } });
  const allDoctors = await prisma.doctor.findMany({ where: { clinic_id: clinic.id } });

  // 7. Create Appointments
  const times = ["09:30 AM", "10:30 AM", "11:45 AM", "02:15 PM", "04:00 PM", "05:30 PM"];
  const diagnoses = [
    "Mild Hypertension - Lifestyle modification & regular monitoring recommended.",
    "Acute Pharyngitis - Prescribed anti-inflammatory & warm saline gargles.",
    "Lumber Spondylosis - Core strengthening physiotherapy recommended.",
    "Seasonal Allergic Rhinitis - Antihistamine regimen for 7 days.",
    "Routine Preventive Health Evaluation - All baseline vitals within normal parameters.",
  ];

  for (let i = 0; i < 15; i++) {
    const patient = allPatients[i % allPatients.length];
    const doctor = allDoctors[i % allDoctors.length];
    const appointmentDate = i < 5
      ? moment().format("YYYY-MM-DD")
      : i < 10
      ? moment().add(i - 4, "days").format("YYYY-MM-DD")
      : moment().subtract(i - 9, "days").format("YYYY-MM-DD");

    const existing = await prisma.appointment.findFirst({
      where: {
        patient_id: patient.id,
        date: appointmentDate,
      },
    });

    if (!existing) {
      await prisma.appointment.create({
        data: {
          clinic_id: clinic.id,
          patient_id: patient.id,
          doctor_id: doctor.id,
          date: appointmentDate,
          time: times[i % times.length],
          status: i < 10 ? "UPCOMING" : "COMPLETED",
          details: `Consultation with Dr. ${doctor.first_name} regarding ongoing health assessment`,
          diagnosis: diagnoses[i % diagnoses.length],
          medical_history: "No known drug allergies reported.",
        },
      });
    }
  }

  // 8. Create Invoices
  const paymentMethods = ["ONLINE", "CASH", "CHEQUE"];
  for (let i = 0; i < allPatients.length; i++) {
    const patient = allPatients[i];
    const amount = (i + 1) * 750 + 500;
    const paymentDate = moment().subtract(i, "days").format("YYYY-MM-DD");

    const existing = await prisma.invoice.findFirst({
      where: {
        patient_id: patient.id,
        payment_date: paymentDate,
      },
    });

    if (!existing) {
      await prisma.invoice.create({
        data: {
          clinic_id: clinic.id,
          patient_id: patient.id,
          amount: parseFloat(amount),
          paid_by: paymentMethods[i % paymentMethods.length],
          transaction_number: `TXN${moment().format("YYYYMMDD")}${1000 + i}`,
          payment_date: paymentDate,
          description: "Clinical Consultation, Diagnostics & Digital Prescription",
          status: "PAID",
          invoice_items: {
            create: [
              { description: "Specialist Consultation Fee", quantity: 1, unit_price: 500, total_price: 500 },
              { description: "Diagnostic Pathology Panel", quantity: 1, unit_price: amount - 500, total_price: amount - 500 },
            ],
          },
        },
      });
    }
  }

  // 9. Create Medicines
  const medicines = [
    { name: "Amoxicillin 500mg", type: "Capsule", dosage: "500mg", description: "Broad-spectrum penicillin antibiotic" },
    { name: "Paracetamol 650mg", type: "Tablet", dosage: "650mg", description: "Analgesic and antipyretic for fever relief" },
    { name: "Cetirizine 10mg", type: "Tablet", dosage: "10mg", description: "Antihistamine for seasonal allergy symptoms" },
    { name: "Azithromycin 500mg", type: "Tablet", dosage: "500mg", description: "Macrolide antibiotic for respiratory tract infections" },
    { name: "Pantoprazole 40mg", type: "Tablet", dosage: "40mg", description: "Proton pump inhibitor for gastroesophageal reflux" },
    { name: "Metformin 500mg", type: "Tablet", dosage: "500mg", description: "First-line medication for type 2 diabetes" },
    { name: "Atorvastatin 20mg", type: "Tablet", dosage: "20mg", description: "Lipid-lowering agent for cardiovascular risk reduction" },
    { name: "Cough Relief Syrup", type: "Syrup", dosage: "10ml", description: "Expectorant and bronchodilator syrup" },
  ];

  for (const m of medicines) {
    const existing = await prisma.medicine.findFirst({ where: { name: m.name } });
    if (!existing) {
      await prisma.medicine.create({
        data: {
          clinic_id: clinic.id,
          ...m,
        },
      });
    }

    const existingMaster = await prisma.masterMedicine.findFirst({ where: { name: m.name } });
    if (!existingMaster) {
      await prisma.masterMedicine.create({
        data: {
          name: m.name,
          type: m.type,
          description: m.description,
        },
      });
    }
  }

  // 10. Create Notes
  const notesData = [
    { title: "Weekly Clinical Review Meeting", description: "Scheduled for Friday 4 PM in Conference Room A. Agenda: Emergency response triage protocols.", date: moment().format("YYYY-MM-DD") },
    { title: "Equipment Calibration Schedule", description: "Ultrasound scanner and ECG machines undergoing periodic preventive maintenance this Saturday.", date: moment().subtract(1, "days").format("YYYY-MM-DD") },
    { title: "Inventory Restocking Alert", description: "Sterile surgical kits, infusion sets, and PPE units restocked from medical supplier.", date: moment().subtract(3, "days").format("YYYY-MM-DD") },
  ];

  for (const n of notesData) {
    const existing = await prisma.note.findFirst({ where: { title: n.title } });
    if (!existing) {
      await prisma.note.create({
        data: {
          clinic_id: clinic.id,
          ...n,
        },
      });
    }
  }

  // 11. Create Prescriptions for Appointments
  const allAppointments = await prisma.appointment.findMany({
    where: { clinic_id: clinic.id },
  });

  const clinicalPrescriptions = [
    [
      { medicine_name: "Amoxicillin 500mg", dosage: "500mg", frequency: "TID (3 times daily)", duration: "5 Days", instructions: "Complete full antibiotic course after food." },
      { medicine_name: "Paracetamol 650mg", dosage: "650mg", frequency: "SOS (As needed)", duration: "3 Days", instructions: "Take if temperature exceeds 100°F." },
      { medicine_name: "Pantoprazole 40mg", dosage: "40mg", frequency: "OD (Once daily)", duration: "5 Days", instructions: "Take 30 mins before morning breakfast." },
    ],
    [
      { medicine_name: "Atorvastatin 20mg", dosage: "20mg", frequency: "OD (Once daily)", duration: "30 Days", instructions: "Take at bedtime with water. Lipid panel in 4 weeks." },
      { medicine_name: "Metformin 500mg", dosage: "500mg", frequency: "BD (Twice daily)", duration: "30 Days", instructions: "Take immediately with main meals." },
    ],
    [
      { medicine_name: "Cetirizine 10mg", dosage: "10mg", frequency: "OD (Once daily)", duration: "7 Days", instructions: "Take at bedtime. Avoid driving if feeling drowsy." },
      { medicine_name: "Cough Relief Syrup", dosage: "10ml", frequency: "TID (3 times daily)", duration: "5 Days", instructions: "Warm water gargles 3 times a day." },
    ],
    [
      { medicine_name: "Azithromycin 500mg", dosage: "500mg", frequency: "OD (Once daily)", duration: "3 Days", instructions: "Take 1 hour before or 2 hours after meals." },
      { medicine_name: "Paracetamol 650mg", dosage: "650mg", frequency: "BD (Twice daily)", duration: "3 Days", instructions: "For fever and generalized body ache." },
    ],
  ];

  for (let i = 0; i < allAppointments.length; i++) {
    const appt = allAppointments[i];
    const existingRx = await prisma.prescription.findFirst({
      where: { appointment_id: appt.id },
    });
    if (!existingRx) {
      const rxItems = clinicalPrescriptions[i % clinicalPrescriptions.length];
      for (const rx of rxItems) {
        await prisma.prescription.create({
          data: {
            clinic_id: clinic.id,
            appointment_id: appt.id,
            patient_id: appt.patient_id,
            doctor_id: appt.doctor_id,
            medicine_name: rx.medicine_name,
            dosage: rx.dosage,
            frequency: rx.frequency,
            duration: rx.duration,
            instructions: rx.instructions,
          },
        });
      }
    }
  }

  console.log("✅ DocDesk database seeding completed successfully!");
  console.log("--------------------------------------------------");
  console.log("🔑 Demo Credentials for Recruiters & Testing:");
  console.log("   🏥 Admin / Medical Director:");
  console.log("      Email:    admin@docdesk.demo (or admin@docto.demo)");
  console.log("      Password: Demo@1234");
  console.log("   🩺 Attending Physician / Doctor:");
  console.log("      Email:    doctor@docdesk.demo (or doctor@docto.demo)");
  console.log("      Password: Demo@1234");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
