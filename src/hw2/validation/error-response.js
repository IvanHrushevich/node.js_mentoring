export const errorResponse = schemaErrors => {
    const errors = schemaErrors.map(error => {
        const { path, message } = error;
        return { path, message };
    });

    return {
        status: 'failed',
        errors
    };
};
