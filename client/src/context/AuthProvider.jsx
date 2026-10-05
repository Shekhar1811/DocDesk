import React, { createContext, useContext, useState, useEffect } from "react";
import { defineAbility } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import tokenService from "../apiServices/token.service";
import { transformPermissions } from "../components/CommonFunctions";

export const AuthContext = createContext();
export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = tokenService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const ability = user ? defineAbilityFor(user) : defineAbility(() => {});

  return (
    <AuthContext.Provider value={{ user, setUser, ability }}>
      <AbilityContext.Provider value={ability}>
        {children}
      </AbilityContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function defineAbilityFor(user) {
  return defineAbility((can) => {
    if (user?.role === "ADMIN" || user?.contact?.role === "ADMIN") {
      can("manage", "all");
      return;
    }

    let permissions = user?.permissions;
    if (Array.isArray(permissions)) {
      permissions = transformPermissions(permissions);
    }
    if (permissions && typeof permissions === "object") {
      Object.keys(permissions).forEach((action) => {
        if (Array.isArray(permissions[action])) {
          permissions[action].forEach((subject) => {
            can(action, subject);
          });
        }
      });
    }
  });
}