import { ZodError } from "zod";
type ZodErrorCode =
  | "invalid_type"
  | "invalid_format"
  | "unrecognized_keys"
  | "invalid_value"

export const formatZodIssues = (error: ZodError) => {
    return error.issues.map(e=>{
        let message=''
        switch(e.code as ZodErrorCode){
            case 'invalid_type':
                message=`field ${e.path.join(", ") || "unknown"} is invalid type,plase provide a valid type`
                break;
            case 'unrecognized_keys':
                message=`You provided extra fields: ${ e.path.join(", ") || "unknown"}. Please remove.`
                break;
             case 'invalid_format':
                message=`field ${ e.path.join(", ") || "unknown"} is not a valid format,plase provide a valid format`
                break;
             case 'invalid_value':
                message=`invalid value,please provide a valid value`
                break;
            default:
                message='please provide a valid information'
        }
        return {
            message
        }
    })
}