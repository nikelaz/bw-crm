import { create } from "zustand";
import sampleUsers from "./data/users";
import sampleEmails from "./data/emails";

export const useStore = create(() => ({
  users: sampleUsers,
  emails: sampleEmails,
}));
