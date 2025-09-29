export const success = ({res, status = 200, message = "Request processed successfully", data = null}) => 
res.status(status).json({message, data })

  