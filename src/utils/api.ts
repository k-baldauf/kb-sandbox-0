// In a production application this would be set dynamically based on environment;
// for the current use case we only have one URL so we use this constant
const BASE_URL = 'https://staging-snap.tablecheck.com/v2/';

export const getData = async <T>(endpointUrl: string): Promise<T> =>
  fetch(`${BASE_URL}${endpointUrl}`)
    .then((response) => response.json())
    .then((data: T) => data);
