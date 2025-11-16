import { create } from "zustand";
import sampleContacts from "./data/contacts";
import sampleEmails from "./data/emails";
import sampleEmailTemplates from "./data/email-templates";

export const useStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  contacts: sampleContacts,
  emails: sampleEmails,
  emailTemplates: sampleEmailTemplates,

  login: (username, password) => {
    const token = "123qwe";
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },

  getContact: (id) => get().contacts.find((contact) => contact.id === id),
  
  getNewestContacts: (limit = 10) => {
    const contacts = get().contacts;
    if (contacts.length <= limit) return contacts;

    return [...contacts]
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  },

  getPopularCountries: (limit = 10) => {
    const contacts = get().contacts;

    const map = new Map();
    for (const contact of contacts) {
      map.set(contact.country, (map.get(contact.country) || 0) + 1);
    }

    return [...map.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  getEmail: (id) => get().emails.find((email) => email.id === id),
  
  getEmailTemplate: (id) => get().emailTemplates.find((emailTemplate) => emailTemplate.id === id),
}));
