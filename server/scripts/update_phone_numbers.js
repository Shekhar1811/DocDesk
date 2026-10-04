const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Updating live database phone numbers to dummy numbers...");

  // Update Patients
  const patientUpdates = [
    { name: "Rajesh Malhotra", mobile: "+91 99999 00001" },
    { name: "Sneha Kapoor", mobile: "+91 99999 00002" },
    { name: "Kunal Singhania", mobile: "+91 99999 00003" },
    { name: "Priya Nair", mobile: "+91 99999 00004" },
    { name: "Deepak Joshi", mobile: "+91 99999 00005" },
    { name: "Meera Sen", mobile: "+91 99999 00006" },
    { name: "Arjun Rampal", mobile: "+91 99999 00007" },
    { name: "Kavita Rao", mobile: "+91 99999 00008" },
  ];

  for (const p of patientUpdates) {
    const updated = await prisma.patient.updateMany({
      where: { name: p.name },
      data: { mobile: p.mobile },
    });
    console.log(`Updated patient ${p.name}: count = ${updated.count}`);
  }

  // Also update any remaining patient with a non-dummy number
  const allPatients = await prisma.patient.findMany();
  for (let i = 0; i < allPatients.length; i++) {
    const p = allPatients[i];
    if (!p.mobile.startsWith("+91 99999")) {
      const dummyNumber = `+91 99999 ${String(i + 1).padStart(5, '0')}`;
      await prisma.patient.update({
        where: { id: p.id },
        data: { mobile: dummyNumber },
      });
      console.log(`Updated patient #${p.id} (${p.name}) to ${dummyNumber}`);
    }
  }

  // Update Doctors
  const doctorUpdates = [
    { email: "aarav.mehta@docdesk.health", mobile: "+91 99999 10001" },
    { email: "pooja.sharma@docdesk.health", mobile: "+91 99999 10002" },
    { email: "vikram.d@docdesk.health", mobile: "+91 99999 10003" },
    { email: "ananya.iyer@docdesk.health", mobile: "+91 99999 10004" },
    { email: "rohan.k@docdesk.health", mobile: "+91 99999 10005" },
  ];

  for (const d of doctorUpdates) {
    await prisma.doctor.updateMany({
      where: { email: d.email },
      data: { mobile: d.mobile },
    });
  }
  console.log("Updated doctors.");

  // Update Employees
  const employeeUpdates = [
    { email: "sunita@docdesk.health", mobile: "+91 99999 20001" },
    { email: "amit@docdesk.health", mobile: "+91 99999 20002" },
    { email: "neha@docdesk.health", mobile: "+91 99999 20003" },
  ];

  for (const emp of employeeUpdates) {
    await prisma.employee.updateMany({
      where: { email: emp.email },
      data: { mobile: emp.mobile },
    });
  }
  console.log("Updated employees.");

  console.log("All phone numbers successfully updated to safe dummy numbers in Supabase!");
}

main()
  .catch((e) => {
    console.error("Error updating phone numbers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
