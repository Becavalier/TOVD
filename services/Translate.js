import axios from 'axios';
import md5 from 'md5';
import translateServiceConfig from '../configurations/TranslateService';

const DEFAULT_INDEX = 0;

export default async (query, { lang }) => {
  const { appid, key } = translateServiceConfig;
  const salt = (new Date).getTime();
  const sign = md5(`${appid}${query}${salt}${key}`);

  const result = (await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
    params: {
      q: query,
      salt: salt,
      sign: sign,
      to: lang || 'zh',
      ...translateServiceConfig,
    }
  })).data;
  
  return result.trans_result && result.trans_result[DEFAULT_INDEX].dst;
};
