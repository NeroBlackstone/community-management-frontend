export const USER_ID='user-id';
export const USER_ROLE='user-role';
export const AUTH_TOKEN='auth-token';
export const TEXT_FIELD_RULES={
    required:str=>value=>!!value||str,
    idNumberMin:str=>v=>v.length>=18||str,
    phoneNumberMin:str=>v=>v.length>=11||str,
    passwordMin:str=>v=>v.length>=6|| str,
};