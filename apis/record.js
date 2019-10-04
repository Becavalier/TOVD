import axios from '../services/Http';

export const httpInsertNewRecord = params => axios.post('/graphql', { 
  query: `
    mutation ($TOVDRecordData: TOVDRecordDataInput!) {
      tovdInsertNewRecord(TOVDRecordData: $TOVDRecordData) {
        result
      }
    }`,
  variables: {
    TOVDRecordData: {
      ...params
    }
  }
});

export const httpRemoveRecord = params => axios.post('/graphql', { 
  query: `
    mutation ($TOVDRecordDataJSON: TOVDRecordDataJSONInput!) {
      tovdRemoveRecord(TOVDRecordDataJSON: $TOVDRecordDataJSON) {
        result
      }
    }`,
  variables: {
    TOVDRecordDataJSON: {
      ...params
    }
  }
});
