// MyApp.js

import React, { useEffect, useState } from 'react';
import { fetchUsersWithProfile, fetchMonthlyReports } from './dhis2Api';
import { generateCSV } from './jsonToCsv2';

import axios from 'axios'

const MyApp = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsersWithProfile = async () => {
      try {
        const usersData = await fetchUsersWithProfile();
        console.log('usersData:', usersData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users with profile:', error);
      }
    };

    getUsersWithProfile();
    sendFileToTelegram();



  }, []);

  // Telegram Bot API endpoint for sending messages
  const telegramAPIEndpoint =
    'https://api.telegram.org/bot6393466642:AAGr_SRJA23ev5m_vRWRlp7HjYJqcAZIa_c/sendMessage'

    // Telegram Bot API endpoint for sending messages
  const telegramDocAPIEndpoint =
  'https://api.telegram.org/bot6393466642:AAGr_SRJA23ev5m_vRWRlp7HjYJqcAZIa_c/sendDocument'

  // Function to send a message to Telegram
  async function sendMessageToTelegram(chatId, message) {
    try {
      const response = await axios.post(telegramAPIEndpoint, {
        chat_id: chatId,
        text: message,
      })

      console.log('Message sent to Telegram:', response.data)

    } catch (error) {
      console.error('Error sending message to Telegram:', error)
    }
  }

  // Function to send a message to Telegram
  async function sendMessagesToTelegram(message) {

    //https://play.dhis2.org/40.0.1/api/analytics.json?dimension=dx:fbfJHSPpUQD;cYeuwXTCPkU&filter=pe:2023Q3
    fetchMonthlyReports("fbfJHSPpUQD;cYeuwXTCPkU", "2023Q3", "year")
      .then((monthlyReports) => {
        console.log('Monthly Reports for Past 5 Years:', monthlyReports);
        generateCSV(monthlyReports)
        sendFileToTelegram();
      })
      .catch((error) => {
        console.error('Error fetching monthly reports:', error);
      });
    users.forEach((user) => {
      console.log('User:', user.telegram);
      console.log(user.telegram);
      sendMessageToTelegram(user.telegram, message)
      console.log("called after");

    });
  }

  async function sendFileToTelegram() {
    console.log("callleddddd");


    const fileName = 'generated_file.txt'; // The desired file name
    const fileContent = 'This is the content of the generated file.'; // Replace with your desired content

    // Create a Blob with the file content
    const blob = new Blob([fileContent], { type: 'text/plain' });

    // Create a FormData instance to send the Blob
    const formData = new FormData();
    formData.append('document', blob, fileName);

    try {
      const chatId = '6051915063' // Replace with the desired chat ID

      const fileUrl = 'locations.csv'; // Replace with the URL of the file you want to send
      const caption = 'Caption for the file (optional)';

      const response = await axios.post(telegramDocAPIEndpoint, formData, {
        
        params: {chat_id: chatId,
       // document: formData,
        caption: caption,
        },
      
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      
      });

      console.log('File sent to Telegram:', response.data);
    } catch (error) {
      console.error('Error sending file to Telegram')

    }
  }
  return (
    <div>
      <h1>Users with Profile</h1>
      <ul>
        {users.map((user) => (

          user.telegram
        ))}
      </ul>
      <button onClick={() => sendMessagesToTelegram('Sent by reagan meantex latest')}>
        Send Telegram Message
      </button>
    </div>
  );
};

export default MyApp;
