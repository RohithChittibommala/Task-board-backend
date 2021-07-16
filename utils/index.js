module.exports.errorFormator = ({ errors }) => {
  if (!errors) return null;

  const keys = Object.keys(errors);
  let validationErrors = "";
  let index = 0;

  for (const key of keys) {
    validationErrors += errors[key]["message"];
  }

  return validationErrors;
};
