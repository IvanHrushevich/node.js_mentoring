export const errorResponse = schemaErrors => {
  const errors = schemaErrors.map(error => {
    let { path, message } = error;
    return { path, message };
  });

  return {
    status: 'failed',
    errors
  };
};
