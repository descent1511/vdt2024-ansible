
import {getErrorMessage} from './getErrorMessage'
export const sendSuccessResponse = (res : any , data : any, message = 'Operation successful') => {
    res.status(200).send({
        status: 'success',
        message,
        data
    });
};

export const sendCreatedResponse = (res : any , data : any, message = 'Resource created successfully') => {
    res.status(201).send({
        status: 'success',
        message,
        data
    });
};

export const sendErrorResponse = (res : any , error : any, statusCode = 400) => {
    res.status(statusCode).send({
        status: 'error',
        message: getErrorMessage(error)
    });
};

export const sendNotFoundResponse = (res: any , message = 'Resource not found') => {
    res.status(404).send({
        status: 'error',
        message
    });
};
