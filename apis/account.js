import axios from '../services/Http';

export const httpSignIn = params => axios.get('/graphql', { 
  params: {
    query: `
      query ($credential: TOVDCredential!) {
        tovdSignInAccount(credential: $credential) {
          result
          token
          id
          username
        }
      }`,
    variables: {
      credential: {
        ...params
      }
    }
  }
});

export const httpSignUp = params => axios.post('/graphql', { 
  query: `
    mutation ($credential: TOVDCredential!) {
      tovdSignUpAccount(credential: $credential) {
        result
        token
        id
        username
      }
    }`,
  variables: {
    credential: {
      ...params
    }
  }
});

export const httpSignOut = () => axios.get('/graphql', { 
  params: {
    query: `
      query {
        tovdSignOutAccount {
          result
        }
      }`
  }
});

export const httpRetrieveAppData = () => axios.get('/graphql', { 
  params: {
    query: `
      query {
        tovdRetrieveAppData {
          result
          data
        }
      }`
  }
});

export const httpTokenValidation = () => axios.get('/graphql', { 
  params: {
    query: `
      query {
        tovdTokenValidation {
          result
          username
        }
      }`
  }
});


export const httpSyncAppData = params => axios.post('/graphql', { 
  query: `
    mutation ($TOVDAppData: TOVDAppDataInput!) {
      tovdSyncAppData(TOVDAppData: $TOVDAppData) {
        result
      }
    }`,
  variables: {
    TOVDAppData: {
      ...params
    }
  }
});
