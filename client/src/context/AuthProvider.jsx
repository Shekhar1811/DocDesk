import React, { createContext, useContext, useState, useEffect } from "react";
import { defineAbility } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import tokenService from "../apiServices/token.service";

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
    const permissions = user.permissions;
    Object.keys(permissions).forEach((action) => {
      permissions[action].forEach((subject) => {
        can(action, subject);
      });
    });
  });
}