import DirectusSDK from "@directus/sdk-js";

import { DIRECT_US_HOST } from "./constants";

const Directus = (function () {
  let instance;

  const createInstance = async () => {
    const client = new DirectusSDK({
      url: DIRECT_US_HOST,
      project: "directus",
      storage: window.localStorage,
    });
    await client.login({
      url: DIRECT_US_HOST,
      project: "directus",
      email: "email@example.com",
      password: "d1r3ctu5",
    });
    return client;
  };

  return {
    getInstance: async () => {
      if (!instance) {
        instance = await createInstance();
      }
      return instance;
    },
  };
})();

export default Directus;
