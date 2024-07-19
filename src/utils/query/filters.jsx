import { capitalizeText } from "../tools";

export const getFilterByCountry = (country) =>
  `
  pagination: { page: 1, pageSize: 10000000 },
  filters: {
    users_permissions_user: {
        organization: {
            department: { 
                country: { 
                    isoCode: { 
                        eq: "${country?.toUpperCase() ?? ''}" 
                    }
                } 
            }
        }
    }
}`;
