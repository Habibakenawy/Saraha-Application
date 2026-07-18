import { NODE_ENV } from "../../../../config/config.service.js"

export const globalErrorHandler = (error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message:
                status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: NODE_ENV == "development" ? error.stack : undefined
        })
    
}

export const ErrorException = ({message="Fail",status = 400, extra=undefined}) =>{
throw  new Error (message,{cause:{status,extra}}) // h throw lama age ast3mlha // lw h return yb2a asheel el new hna 
}

export const ConflictException = ({message = "Conflict",extra}) =>{
    return ErrorException({message,status:409,extra})
}

export const NotFoundException = ({message = "NotFound",extra}) =>{
    return ErrorException({message,status:404,extra})
}

export const UnauthorizedException = ({message = "Unauthorized",extra}) =>{
    return ErrorException({message,status:401,extra})
}