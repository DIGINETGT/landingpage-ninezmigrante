import { capitalizeText } from "../tools";
import { year as currentYear } from "../year";

export const getFilterByCountry = (
  country,
  period = [1, 12],
  year = currentYear,
  customKey = "reportMonth"
) =>
  `
  pagination: { page: 1, pageSize: 10000000 },
  filters: {
    ${customKey}: {
        gte: "${year}-${period[0] < 10 ? `0${period[0]}` : period[0]}-01",
        lte: "${year}-${period[1] < 10 ? `0${period[1]}` : period[1]}-28"
    },
    users_permissions_user: {
        organization: {
            department: { 
                country: { 
                    isoCode: { 
                        eq: "${country?.toUpperCase() ?? ""}" 
                    }
                } 
            }
        }
    }
}`;

export const getFilterByPeriod = (
  period = [1, 12],
  year = currentYear,
  customKey = "reportMonth"
) =>
  `
    pagination: { page: 1, pageSize: 10000000 },
    filters: {
        ${customKey}: {
            gte: "${year}-${period[0] < 10 ? `0${period[0]}` : period[0]}-01",
            lte: "${year}-${period[1] < 10 ? `0${period[1]}` : period[1]}-28"
        }
    }`;
