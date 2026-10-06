export const getJDoodleConfig = () => {
  return {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    baseURL: 'https://api.jdoodle.com/v1/execute'
  };
};
