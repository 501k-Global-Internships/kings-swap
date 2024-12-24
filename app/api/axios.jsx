import axios from 'axios';

const BASE_URL = "https://cabinet.kingsswap.com.ng";

export default axios.create({
  baseURL: BASE_URL,
});