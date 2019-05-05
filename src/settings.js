export const USER_ID='user-id';
export const AUTH_TOKEN='auth-token';
//export const ITEM_PER_PAGE=5;
export const TEXT_FIELD_RULES={
    required:value=>!!value||'Required',
    idNumberMin:v=>v.length>=18||'Please enter the 18-digit ID number',
    phoneNumberMin:v=>v.length>=11||'Please enter the 11-digit phone number',
};