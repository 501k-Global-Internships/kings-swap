import axios from 'axios';

const BASE_URL = "https://dev.cabinet.kingsswap.com.ng";

export default axios.create({
  baseURL: BASE_URL,
});