import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
  [pages.insurancePage]: `${config.UI_URL_PREFIX}/${pages.insurancePage}`,
  [pages.insuranceDetailsPage]: `${config.UI_URL_PREFIX}/${pages.insuranceDetailsPage}`,
  [pages.clientPage]: `${config.UI_URL_PREFIX}/${pages.clientPage}`,
  [pages.clientsDetailsPage]: `${config.UI_URL_PREFIX}/${pages.clientsDetailsPage}`,
};

export default result;
