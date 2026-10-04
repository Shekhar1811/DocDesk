const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/";
export const API_URL = rawApiUrl.endsWith("/") ? rawApiUrl : `${rawApiUrl}/`;
export const IMAGE_URL = `${API_URL}public`;
export const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "TRANSGENDER", label: "Transgender" },
];
