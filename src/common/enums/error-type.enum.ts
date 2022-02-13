/**
 * [description]
 */
export enum ErrorTypeEnum {
  /**
   * AUTH
   */
  AUTH_INCORRECT_CREDENTIALS = 'AUTH_INCORRECT_CREDENTIALS',
  AUTH_INVALID_TOKEN = 'AUTH_INVALID_TOKEN',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',

  NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME = 'NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME',
  AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE = 'AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE',

  /**
   * USER
   */
  USER_ALREADY_EXIST = 'USER_ALREADY_EXISTS',
  USERS_NOT_FOUND = 'USERS_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',

  /**
   * ACCOUNT
   */
  ACCOUNT_ALREADY_EXIST = 'ACCOUNT_ALREADY_EXISTS',
  ACCOUNTS_NOT_FOUND = 'ACCOUNTS_NOT_FOUND',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
}
