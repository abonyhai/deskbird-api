export const IS_PRODUCTION = () => {
  return process.env.NODE_ENV === 'production';
};
export const IS_STAGING = () => {
  return process.env.NODE_ENV === 'staging';
};

export const IS_DEV = () => {
  // Default to development mode
  return !IS_STAGING() && !IS_PRODUCTION();
};
