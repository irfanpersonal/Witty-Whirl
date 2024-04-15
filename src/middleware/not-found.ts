import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

const notFound = (req: Request, res: Response) => {
    return res.status(StatusCodes.NOT_FOUND).send('<h1>NOT FOUND</h1>');
}

export default notFound;