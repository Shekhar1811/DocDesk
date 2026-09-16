import { confirmAlert } from "react-confirm-alert";
import { useState, useEffect } from 'react';

export const formatDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export const getInitials = (fullName) => {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  if (names.length === 1) {
    // If only one name is provided, return the first character of that name
    return names[0].charAt(0).toUpperCase();
  }
  const firstName = names[0];
  const lastName = names[names.length - 1]; // Consider the last part as the last name
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
};
export const transformPermissions = (permissionsArray) => {
  const permissions = {
    list: [],
    read: [],
    add: [],
    edit: [],
    delete: [],
  };

  permissionsArray.forEach((permission) => {
    if (permission.startsWith("list")) {
      permissions.list.push(permission.slice(4));
    } else if (permission.startsWith("read")) {
      permissions.read.push(permission.slice(4));
    } else if (permission.startsWith("add")) {
      permissions.add.push(permission.slice(3));
    } else if (permission.startsWith("edit")) {
      permissions.edit.push(permission.slice(4));
    } else if (permission.startsWith("delete")) {
      permissions.delete.push(permission.slice(6));
    }
  });

  return permissions;
};

export const showAlert = (module, confirmFunction, params) => {
  confirmAlert({
    title: "Confirm to delete",
    message: `Are you sure you want to delete this ${module}.`,
    buttons: [
      {
        label: "Yes",
        onClick: () => confirmFunction(params),
      },
      {
        label: "No",
      },
    ],
  });
};

export const handleValidationError = (data) => {
  const messages = data?.response?.data?.messages;
  if (messages) {
    let errors = [];
    for (let field in messages) {
      if (messages.hasOwnProperty(field)) {
        errors.push(messages[field].join(" "));
      }
    }
    const errorMessage = errors.join(" ");
    return errorMessage;
  } else {
    return data.message;
  }
};

 export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);

    return () => media.removeListener(listener);
  }, [query, matches]);
  return matches;
}