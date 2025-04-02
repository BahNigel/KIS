// AddContactsUtils.tsx
import * as Contacts from "expo-contacts"; // Import Expo Contacts
import { CacheKeys, CacheTypes } from "@/src/routes/cacheKeys";
import { postRequest } from "@/src/routes/post";
import { getCachedDataByKey } from "@/src/routes/cache";
import ROUTES from "@/src/routes";

// Define types for function parameters
interface FetchContactsParams {
  setLoading: (loading: boolean) => void;
  setStoredContacts: (contacts: ContactData[]) => void;
  setNonStoredContacts: (contacts: ContactData[]) => void;
}

interface FetchWebContactsParams {
  phoneOrEmail: string;
  setStoredContacts: (contacts: ContactData[]) => void;
}

// Define types for the contact data
interface ContactData {
  id: string; // Ensure `id` is always a string
  name: string;
  contact: string[]; // Array of phone numbers
  image: string | null; // Can be null if no image
}

// Fetch contacts from device
export const fetchContacts = async ({
  setLoading,
  setStoredContacts,
  setNonStoredContacts,
}: FetchContactsParams) => {

  console.log("Nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnndndndndndndndndndnddndndndndndn")
  try {
    setLoading(true);
    const permission = await Contacts.requestPermissionsAsync();

    if (permission.status !== "granted") {
      console.log("Permission denied");
      setLoading(false);
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    const phoneNumbers: string[] = [];
    data.forEach((contact) => {
      if (contact.phoneNumbers) {
        contact.phoneNumbers.forEach((phoneNumber) => {
          if (phoneNumber.number) {
            const fullNumber = phoneNumber.number.replace(/[\s+-]/g, ""); // Remove spaces, plus, and hyphen
            phoneNumbers.push(fullNumber);
          }
        });
      }
    });

    const cacheType = CacheTypes.REGISTERED_CONTACTS;
    const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;
    const options = {
      headers: { "Content-Type": "application/json" },
      cacheKey: cacheKey,
      cacheType: cacheType,
    };

    // Fetch registered contacts from backend
    const response = await postRequest(ROUTES.contacts.check, phoneNumbers, options);

    const stored_data: ContactData[] = await getCachedDataByKey(cacheType, cacheKey);

    console.log("Stored Data: ", stored_data);

    // Update state with formatted contacts
    const formattedContacts: ContactData[] = data.map((contact) => {
      const phoneNumbers: string[] = [];

      if (contact.phoneNumbers) {
        contact.phoneNumbers.forEach((phoneNumber) => {
          if (phoneNumber.number) {
            const fullNumber = phoneNumber.number.replace(/[\s+-]/g, "");
            phoneNumbers.push(fullNumber);
          }
        });
      }

      return {
        id: contact.id || "",
        name: contact.name || "Unknown",
        contact: phoneNumbers,
        image: null,
      };
    });

    const nonStoredContacts: ContactData[] = formattedContacts.filter((contact) =>
      !stored_data.some((stored) =>
        Array.isArray(contact.contact) && contact.contact.some((number) => stored.contact.includes(number))
      )
    );

    setStoredContacts(stored_data);
    setNonStoredContacts(nonStoredContacts);
  } catch (err) {
    console.warn(err);
  } finally {
    setLoading(false);
  }
};


export const fetchWebContacts = async ({
  phoneOrEmail,
  setStoredContacts,
}: FetchWebContactsParams) => {
  try {
    const cacheType = CacheTypes.REGISTERED_CONTACTS;
    const cacheKey = CacheKeys.REGISTERED_CONTACTS_KEY;
    const options = {
      headers: { "Content-Type": "application/json" },
      cacheKey: cacheKey,
      cacheType: cacheType,
    };

    // Fetch registered contacts from backend
    if (phoneOrEmail !== ""){
      const response = await postRequest(ROUTES.contacts.check, phoneOrEmail, options);
    }
    

    const stored_data: ContactData[] = await getCachedDataByKey(cacheType, cacheKey);


    setStoredContacts(stored_data);

    console.log("Stored Data: ", stored_data);
  } catch (err) {
    console.warn(err);
  }
};

