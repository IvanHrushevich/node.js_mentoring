import { ValidationErrorItem } from '@hapi/joi';

import { HttpError } from './../utils/http-error';

export const errorResponse = (schemaErrors: ValidationErrorItem[]) => {
    const errors = schemaErrors.map(error => {
        const { path, message } = error;
        return { path, message };
    });

    return new HttpError(400, 'Validation error', errors);
};
