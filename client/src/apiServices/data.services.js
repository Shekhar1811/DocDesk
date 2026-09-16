import api, { assetInstance } from "./api";
import { API_URL } from "../constants";
class DataService {
  async signIn(payload = {}) {
    return api.post(API_URL + "api/login", payload);
  }
  async signUp(payload = {}) {
    return api.post(API_URL + "api/register", payload);
  }
  async logout(payload = {}) {
    return api.post(API_URL + "api/logout", payload);
  }
  async getUser() {
    return api.get(API_URL + "api/user");
  }
  async getClinic(id) {
    return api.get(API_URL + "api/clinics/" + id);
  }
  async editClinic(id, payload = {}) {
    return api.patch(API_URL + `api/clinics/${id}`, payload);
  }
  async uploadClinicDocs(id, url, payload = {}) {
    return assetInstance.post(
      API_URL + `api/clinic_${url}_uploads/${id}`,
      payload
    );
  }
  /* async uploadClinicDocs(id, payload = {}) {
    return assetInstance.post(API_URL + `api/clinic_uploads/${id}`, payload);
  } */
  async updateUser(id, payload = {}) {
    return api.patch(API_URL + "api/user_update/" + id, payload);
  }

  /* Employees */
  async getEmployees() {
    return api.get(API_URL + "api/employees");
  }
  async getEmployeeDetails(id) {
    return api.get(API_URL + "api/employees/" + id);
  }
  async addEmployee(payload = {}) {
    return api.post(API_URL + "api/employees", payload);
  }
  async editEmployee(id, payload = {}) {
    return api.patch(API_URL + `api/employees/${id}`, payload);
  }
  async deleteEmployee(id) {
    return api.delete(API_URL + `api/employees/${id}`);
  }

  /* Patients */
  async getPatients() {
    return api.get(API_URL + "api/patients");
  }
  async getPatientsSlim(str) {
    let url = str ? "api/patients/slim" + str : "api/patients/slim";
    return api.get(API_URL + url);
  }
  async getPatientsDetails(id) {
    return api.get(API_URL + "api/patients/" + id);
  }
  async addPatients(payload = {}) {
    return api.post(API_URL + "api/patients", payload);
  }
  async editPatients(id, payload = {}) {
    return api.patch(API_URL + `api/patients/${id}`, payload);
  }
  async uploadPatientDocs(id, payload = {}) {
    return assetInstance.post(API_URL + `api/patient_uploads/${id}`, payload);
  }
  async deletePatient(id) {
    return api.delete(API_URL + `api/patients/${id}`);
  }

  /* Doctors */
  async getDoctors() {
    return api.get(API_URL + "api/doctors");
  }
  async getDoctorDetails(id) {
    return api.get(API_URL + "api/doctors/" + id);
  }
  async addDoctor(payload = {}) {
    return api.post(API_URL + "api/doctors", payload);
  }
  async editDoctor(id, payload = {}) {
    return api.patch(API_URL + `api/doctors/${id}`, payload);
  }
  async deleteDoctor(id) {
    return api.delete(API_URL + `api/doctors/${id}`);
  }

  /* Appointments */
  async getAppointments(startDate, endDate, days, status) {
    let url = `${API_URL}api/appointments?`;
    if (startDate) {
      url += `start_date=${startDate}&`;
    }
    if (endDate) {
      url += `end_date=${endDate}&`;
    }
    if (days) {
      url += `days=${days}&`;
    }
    if (days) {
      url += `status=${status}&`;
    }
    url = url.slice(0, -1);
    return api.get(url);
  }
  async getAppointmentHistory(id) {
    return api.get(API_URL + "api/appointments?patient_id=" + id);
  }
  async getAppointmentDetails(id) {
    return api.get(API_URL + "api/appointments/" + id);
  }
  async getAppointmentDocs(id) {
    return api.get(
      API_URL + "api/appointments?patient_id=" + id + "&assets=true"
    );
  }
  async addAppointments(payload = {}) {
    return api.post(API_URL + "api/appointments", payload);
  }
  async editAppointments(id, payload = {}) {
    return api.patch(API_URL + `api/appointments/${id}`, payload);
  }
  async deleteAppointment(id) {
    return api.delete(API_URL + `api/appointments/${id}`);
  }
  async uploadAppointmentDocs(id, payload = {}) {
    return assetInstance.post(
      API_URL + `api/appointment_uploads/${id}`,
      payload
    );
  }

  /* Package */
  async addPackage(payload = {}) {
    return api.post(API_URL + "api/packages", payload);
  }
  async getPackages() {
    return api.get(API_URL + "api/packages");
  }
  async getPackageDetails(id) {
    return api.get(API_URL + "api/packages/" + id);
  }
  async deletePackage(id) {
    return api.delete(API_URL + `api/packages/${id}`);
  }
  async editPackage(id, payload = {}) {
    return api.patch(API_URL + `api/packages/${id}`, payload);
  }
  /* Notes */
  async addNote(payload = {}) {
    return api.post(API_URL + "api/notes", payload);
  }
  async getNotes() {
    return api.get(API_URL + "api/notes");
  }
  async getNoteDetails(id) {
    return api.get(API_URL + "api/notes/" + id);
  }
  async deleteNote(id) {
    return api.delete(API_URL + `api/notes/${id}`);
  }
  async editNote(id, payload = {}) {
    return api.patch(API_URL + `api/notes/${id}`, payload);
  }

  /* Medicines */
  async addMedicine(payload = {}) {
    return api.post(API_URL + "api/medicines", payload);
  }
  async getMedicines() {
    return api.get(API_URL + "api/medicines");
  }
  async getMedicineDetails(id) {
    return api.get(API_URL + "api/medicines/" + id);
  }
  async deleteMedicine(id) {
    return api.delete(API_URL + `api/medicines/${id}`);
  }
  async editMedicine(id, payload = {}) {
    return api.patch(API_URL + `api/medicines/${id}`, payload);
  }
  async getMasterMedicines() {
    return api.get(API_URL + "api/master_medicines");
  }
  async getPrescriptions(id) {
    return api.get(API_URL + "api/prescriptions?appointment_id=" + id);
  }
  async addPrescriptions(payload = {}) {
    return api.post(API_URL + "api/prescriptions", payload);
  }
  async editPrescriptions(id, payload = {}) {
    return api.patch(API_URL + `api/prescriptions/${id}`, payload);
  }
  async deletePrescription(id) {
    return api.delete(API_URL + `api/prescriptions/${id}`);
  }

  /* Invoices (Bills) */
  async addInvoice(payload = {}) {
    return api.post(API_URL + "api/invoices", payload);
  }
  async getInvoices(patientId) {
    let url = `${API_URL}api/invoices?`;
    if (patientId) {
      url += `patient_id=${patientId}&`;
    }
    return api.get(url);
  }

  async getInvoiceDetails(id) {
    return api.get(API_URL + "api/invoices/" + id);
  }
  async editInvoice(id, payload = {}) {
    return api.patch(API_URL + `api/invoices/${id}`, payload);
  }

  /* Reports */
  async getReports(startDate, endDate, paymentMethod, patientId) {
    let url = `${API_URL}api/invoices/reports?`;
    if (startDate) {
      url += `start_date=${startDate}&`;
    }
    if (endDate) {
      url += `end_date=${endDate}&`;
    }
    if (paymentMethod) {
      url += `paid_by=${paymentMethod}&`;
    }
    if (patientId) {
      url += `patient_id=${patientId}&`;
    }
    url = url.slice(0, -1);
    return api.get(url);
  }
  /* Dashboard */
  async getStats(days) {
    let url = `${API_URL}api/invoices/stats?`;
    if (days) {
      url += `days=${days}&`;
    }
    url = url.slice(0, -1);
    return api.get(url);
  }

  async getPrintInvoiceDetails(id) {
    return api.get(API_URL + "api/print_invoice/" + id);
  }
}
export default new DataService();
