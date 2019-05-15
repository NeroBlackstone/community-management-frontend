export const USER_ID='user-id';
export const USER_ROLE='user-role';
export const AUTH_TOKEN='auth-token';
export const TEXT_FIELD_RULES={
    required:value=>!!value||'必填',
    idNumberMin:v=>v.length>=18||'请输入18位身份证号',
    phoneNumberMin:v=>v.length>=11||'请输入11位电话号码',
    passwordMin:v=>v.length>=6||'请输入至少6位长度的密码',
};