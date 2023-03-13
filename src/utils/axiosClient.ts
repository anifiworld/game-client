import axios from 'axios';
import dayjs from 'dayjs';
import Web3 from 'web3';

let axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API,
  timeout: 30000,
});

export const getAxiosClient = () => axiosClient;
export const setAxiosClient = (token?: string, onUnauthorized?: () => void) => {
  if (token)
    axiosClient.defaults.headers.common.authorization = `Bearer ${token}`;
  axiosClient.interceptors.response.use(
    (resp) => resp,
    (err) => {
      if (err.response.status === 401) {
        if (onUnauthorized) onUnauthorized();
      }
    },
  );
};

export const getLoginMessage = (validTo: string) =>
  `Hey! You're logging in to the AniFi. Please sign this message to confirm your identity.\n\nValid until ${validTo}`;
export const getAccessToken = async (web3: Web3) => {
  const validTo = dayjs().add(5, 'minute').toISOString();
  const accountAddress = (await web3.eth.requestAccounts())[0];
  const signature = await web3.eth.personal.sign(
    getLoginMessage(validTo),
    accountAddress,
    '',
  );
  //TODO use token from server
  // const response = await axiosClient.post(API.LOGIN, {
  //   validTo,
  //   signature,
  // });
  const response = {
    data: {
      access_token: 'xxxxx',
    },
  };
  return response.data.access_token;
};