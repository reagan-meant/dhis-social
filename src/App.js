// MyApp.js

import React, { useEffect, useState } from 'react';
import { fetchUsersWithProfile } from './dhis2Api';
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

    
  }, []);

// Telegram Bot API endpoint for sending messages
const telegramAPIEndpoint =
  'https://api.telegram.org/bot6393466642:AAGr_SRJA23ev5m_vRWRlp7HjYJqcAZIa_c/sendMessage'

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
async function sendMessagesToTelegram( message) {
  users.forEach((user) => {
    console.log('User:', user.telegram);
    console.log(user.telegram);
    sendMessageToTelegram(user.telegram, message)
    console.log("called after");

  });
}




  return (
    <div>
      <h1>Users with Profile</h1>
      <ul>
        {users.map((user) => (
          
          user.telegram
        ))}
      </ul>
      <button onClick={() => sendMessagesToTelegram('Your Telegram message here')}>
              Send Telegram Message
            </button>
    </div>
  );
};

export default MyApp;
