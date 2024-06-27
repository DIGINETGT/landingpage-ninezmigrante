import { capitalizeText } from "../tools";

export const getFilterByCountry = (country) =>
  `filters: {
    users_permissions_user: {
        organization: {
            department: { 
                country: { 
                    name: { 
                        eq: "${capitalizeText(country)}" 
                    }
                } 
            }
        }
    }
}`;
