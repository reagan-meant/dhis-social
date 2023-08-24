// dhis2Api.js

import axios from 'axios';

// Replace these with your DHIS2 instance URL and credentials
const DHIS2_BASE_URL = 'http://localhost:8080/api';
const DHIS2_BASE_URL_PLAY = 'https://play.dhis2.org/40.0.1/api';

const USERNAME = 'admin';
const PASSWORD = 'district';

// Function to fetch users with their profile information from DHIS2 instance
export const fetchUsersWithProfile = async () => {
  try {
    const response = await axios.get(`${DHIS2_BASE_URL}/users`, {
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      params: {
        fields: 'telegram',
        paging: false,
      },
    });

    // Filter only the users who have a Telegram ID
    const usersWithTelegram = response.data.users.filter(
        (user) => user.telegram
      );
  
      return usersWithTelegram;

  } catch (error) {
    console.error('Error fetching users with profile:', error);
    throw error;
  }
};

// Function to fetch monthly reports from DHIS2
export const fetchMonthlyReports = async (dataElementCodes, periodType, year) => {
    try {
      //https://play.dhis2.org/40.0.1/api/analytics.json?dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU&filter=pe:2023Q3
      const response = await axios.get(`${DHIS2_BASE_URL_PLAY}/analytics`, {
        auth: {
          username,
          password
        },
        params: {
          dimension: `dx:${dataElementCodes}`,
//          filter: `pe:${periodType}${year}`,
          filter: `pe:${periodType}`,

          displayProperty: 'NAME',
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly reports:', error);
      throw error;
    }
}


// Function to fetch monthly reports from DHIS2
export const fetchMonthlyReports2 = async (dataElementCodes, periodType, year) => {
  try {
    const response = await axios.get(`${DHIS2_BASE_URL_PLAY}/analytics`, {
      auth: {
        username: USERNAME,
        password: PASSWORD,
      },
      params: {
        dimension: `dx:${'DE_359596:DE_359596'.join(';')}`,
        filter: `pe:${periodType}${year}`,
        tableLayout: true,
        columns:`dx`,
        displayProperty: 'NAME',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    throw error;
  }
}