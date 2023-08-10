import Papa from 'papaparse';

export async function generateCSV(jsonData) {
  try {
    // Convert the rows in the JSON data to an array of arrays
   /*  const csvData = jsonData.rows.map((row) =>
      jsonData.headers.map((header) => row[header.name])
    ); */

    /* const csvData = jsonData.rows.map((row) => {
      const obj = {};
      jsonData.headers.forEach((header, index) => {
        obj[header.column] = row[index];
      });
      return obj;
    }); */
    const { headers, metaData, rows } = jsonData;

    // Create a mapping of dx values to their corresponding names
    const dxNameMapping = Object.fromEntries(
      rows.map((row) => [row[1], metaData.items[row[0]].name])
    );

    // Convert the rows in the JSON data to an array of arrays
    const csvData = rows.map((row) => [
      dxNameMapping[row[1]], // Use the name from the mapping
      row[1], // Keep the original value
    ]);
    
    // Generate CSV format using PapaParse
    const csv = Papa.unparse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // Create a Blob with the CSV data
    const blob = new Blob([csv], { type: 'text/csv' });

    // Create a download link for the Blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'output.csv';
    link.textContent = 'Download CSV';

    // Append the link to the DOM and simulate a click to trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('CSV download initiated successfully!');
  } catch (error) {
    console.error('Error generating CSV:', error);
  }
}
