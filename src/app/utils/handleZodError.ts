import { ZodError } from "zod";
export const formatZodIssues = (error: ZodError) => {
    return error.issues.map(e=>{
        let message=''
        switch(e.code){
            case 'invalid_type':
                message=`field ${e.path.join(", ") || "unknown"} expected ${e.expected} type,but  received ${e.input},please provide a valid type`
                break;
            case 'unrecognized_keys':
                message=`You provided extra fields: ${ e.keys || "unknown"}. Please remove keys ${e.keys}`
                break;
             case 'invalid_format':
                message=`field ${ e.path.join(',') || "unknown"} is not a valid format(${e.format}) but received ${e.input},please prrovide a valid format`
                break;
             case 'invalid_value':
                message=`Invalid value. Allowed values are (${e.values}) but received ${e.input},plese provide a currect value`
                break;
             case 'too_big':
                message=`field  ${e.path} provide a big data,received ${e.input},please provide a valid value`
                break;
            case 'too_small':
                message=`field  ${e.path} provide a small data,received ${e.input},please provide a valid value`
                break;
            default:
                message=`field ${e.path} is invalid data,received ${e.input}`
        }
        return {
            message
        }
    })
}