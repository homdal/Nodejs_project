const validation = (schema, userBody) => {
  const { error } = schema.validate(userBody, { abortEarly: false });
  if (!error) {
    return false;
  }

  let errorObj = {};
  const { details } = error;
  for (let item of details) {
    let key = item.path[0];
    let { message } = item;
    errorObj[key] = message;
  }
  return errorObj;
};
export default validation;
