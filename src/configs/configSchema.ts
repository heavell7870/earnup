import Joi from 'joi'

export const ValidConfigurationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development').description('node env is missing'),
    PORT: Joi.number().min(1000).default(9889).description('port number is missing'),
    MONGO_CONN_STR: Joi.string().required().description('mongo prefix missing in config file')
}).unknown()

