import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import classes from './App.module.css'
import axios from 'axios';

const query = {
    me: {
        resource: 'me',
    },
}


// Telegram Bot API endpoint for sending messages
const telegramAPIEndpoint = 'https://api.telegram.org/bot6393466642:AAGr_SRJA23ev5m_vRWRlp7HjYJqcAZIa_c/sendMessage';

// Function to send a message to Telegram
async function sendMessageToTelegram(chatId, message) {
  try {
    const response = await axios.post(telegramAPIEndpoint, {
      chat_id: chatId,
      text: message
    });

    console.log('Message sent to Telegram:', response.data);
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Usage example
const chatId = '6051915063'; // Replace with the desired chat ID
const message = 'Hello, Telegram!'; // Replace with your message

sendMessageToTelegram(chatId, message);

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
                if (error) {
                    return <span>ERROR</span>
                }
                if (loading) {
                    return <span>...</span>
                }
                return (
                    <>
                        <h1>
                            {i18n.t('Hello {{name}}', { name: data.me.name })}
                        </h1>
                        <h1>
                        {(1+3)}
                        </h1>
                        <h3>{i18n.t('Welcome to DHIS2!')}</h3>
                    </>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
