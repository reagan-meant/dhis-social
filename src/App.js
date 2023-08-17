import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { useDataEngine } from '@dhis2/app-runtime'
import axios from 'axios'

const DatasetSelector = () => {
  const datasetQuery = {
    datasets: {
      resource: 'dataSets',
      params: {
        fields: 'id,displayName',
      },
    },
  };

  const organizationQuery = {
    resource: 'organisationUnits',
    params: {
      fields: 'id,name',
      paging: 'false',
    },
  };

  const orgUnitQuery = {
    orgUnit: {
      resource: 'organisationUnits',
      params: {
        fields: ['id,displayName']
      }
    }
  }

  const userQuery = {
    user: {
      resource: 'users',
      params: {
        fields: ['telegram'],
        filter: 'telegram:!null:'
      }
    }
  };

  const dataValueSetQuery = (datasetId, orgUnit) => ({
    dataValueSets: {
      resource: 'dataValueSets.csv',
      params: {
        dataSet: datasetId,
        orgUnit: orgUnit,
        startDate: '2018-01-01',
        endDate: '2023-10-01',
        paging: false,
      },
    },
  });

  const { loading: datasetLoading, error: datasetError, data: datasetData } = useDataQuery(datasetQuery);
  const { loading: loading, error: error, data: orgData } = useDataQuery(orgUnitQuery);
  const { loading: loadingUser, error: userError, data: dhisUsers } = useDataQuery(userQuery);

  const { loading: datavalesetLoading, error: datavaluesetError, data: datavluesetData } = useDataQuery(datasetQuery);
  const engine = useDataEngine()

  const [selectedDataset, setSelectedDataset] = useState(null);
  const [dataValueSets, setDataValueSets] = useState([]);
  const [dhisUsersValue, setdhisUsersValue] = useState([]);
  const myarray = [];


  const [selectedOrganization, setSelectedOrganization] = useState('');




  const ben = useDataQuery(orgUnitQuery);


  const handleOrganizationChange = (event) => {

    setSelectedOrganization(event.target.value);
  };

  useEffect(() => {

    if (dhisUsers) {
      for (const user of dhisUsers.user.users) {
        //telegramUsers.push(user.telegram);
        myarray.push(user.telegram)

      }
      setdhisUsersValue(myarray);

    }
  }, [selectedDataset, selectedOrganization]);

  const fetchUsersWithProfile = async () => {
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


  const handleDatasetChange = (event) => {
    const datasetId = event.target.value;
    console.log(datasetId)
    setSelectedDataset(datasetId);



  };

  const sendFileToTelegram = () => {

    if (selectedDataset) {
      if (selectedDataset && selectedOrganization && dhisUsersValue) {
        //setLoading(true)

        const dataValueSetQueryObj = dataValueSetQuery(selectedDataset, selectedOrganization);

        engine.query(dataValueSetQueryObj).then((response) => {

          // Create a FormData instance to send the Blob
          const formData = new FormData();
          formData.append('document', response.dataValueSets, "fileName");


          for (const dhis of dhisUsersValue) {

            try {
              //const chatId = '6051915063' // Replace with the desired chat ID
              const chatId = dhis // Replace with the desired chat ID

              const telegramDocAPIEndpoint =
                'https://api.telegram.org/bot6393466642:AAGr_SRJA23ev5m_vRWRlp7HjYJqcAZIa_c/sendDocument'

              //const fileUrl = 'locations.csv'; // Replace with the URL of the file you want to send
              const caption = 'Caption for the file (optional)';

              const response = axios.post(telegramDocAPIEndpoint, formData, {

                params: {
                  chat_id: chatId,
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

        })
      }


    }
  }

  const fetchDataValueSets = async (queryObj) => {
    console.log(
      "dddd"
    )
    const { loading, error, data } = useDataQuery(queryObj);

    try {
      const { loading, error, data } = useDataQuery(queryObj);
      console.log(data)
      if (!loading && !error && data && data.dataValueSets) {
        setDataValueSets(data.dataValueSets);
      }
    } catch (error) {
      console.error('Error fetching data value sets:', error);
    }
  };
  return (
    <div>
      <h3>Select a Dataset</h3>
      {datasetLoading && <span>Loading datasets...</span>}
      {datasetError && <span>{`ERROR: ${datasetError.message}`}</span>}
      {datasetData && datasetData.datasets.dataSets ? (
        <>
          <select onChange={handleDatasetChange}>
            <option value="">Select a dataset</option>
            {datasetData.datasets.dataSets.map((dataset) => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.displayName}
              </option>
            ))}
          </select>

        </>
      ) : (
        <span>No datasets available.</span>
      )}

      <h3>Select an org</h3>
      {orgData && orgData.orgUnit.organisationUnits ? (

        <div>
          <select value={selectedOrganization} onChange={handleOrganizationChange}>
            <option value="">Select an organization</option>
            {orgData.orgUnit.organisationUnits.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.displayName}
              </option>
            ))}
          </select>
        </div>) : (<span>No orgs available.</span>)}

      <button onClick={() => sendFileToTelegram()}>
        Send Telegram Message
      </button>
    </div>

  );
};

export default DatasetSelector;

