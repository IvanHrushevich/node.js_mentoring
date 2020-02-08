import { ValidationErrorItem } from '@hapi/joi';

export const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
    const errors = schemaErrors.map(error => {
        const { path, message } = error;
        return { path, message };
    });

    return {
        status: 'failed',
        errors
    };
};
