
/*
/ Types for request and response bodies.
/
/ Typings for requests are grouped into three categories, each following a common naming convention
/ that mimics the convention used by Express.
/   - Request Query Parameters: Typed as `xxxRequestQuery`
/   - Request Path Parameters: Typed as `xxxRequestParams`
/   - Request Body: Typed as `xxxRequestBody`
/
/ Typings for responses always correspond to the response body, and use a single naming convention.
/  - Response Body: Typed as `xxxResponse`
*/

/*
/ Quote Endpoint Types
*/

// Query parameters for all /quote endpoints
export type QuoteRequestQuery = {
  fiatType: FiatType
  cryptoType: CryptoType
  fiatAmount?: string
  cryptoAmount?: string
  country: string
  region?: string
}

// Response body for all /quote endpoints
export type QuoteResponse = {
  quote: {
    fiatType: FiatType
    cryptoType: CryptoType
    fiatAmount: string
    cryptoAmount: string
    guaranteedUntil?: string
  }
  kyc: {
    kycRequired: boolean
    kycSchemas: KycSchema[]
  }
  fiatAccount: Record<FiatAccountType, FiatAccountTypeQuoteData>
}

// Helper type
export type FiatAccountTypeQuoteData = {
  fiatAccountSchemas: FiatAccountSchema[]
  fee?: string
  feeType?: FeeType
  feeFrequency?: FeeFrequency
  settlementTimeLowerBound?: string // ISO-8601 Duration
  settlementTimeUpperBound?: string // ISO-8601 Duration
}

/*
/ KYC Endpoint Types
*/

// Path parameters for all KYC endpoints
export type KycRequestParams = {
  kycSchema: KycSchema
}

// Response body for POST /kyc/:kycSchema and GET /kyc/:kycSchema/status
export type KycStatusResponse = {
  kycStatus: KycStatus
}

/*
/ Fiat Account Endpoint Types
*/

// Path parameters for POST /accounts/:fiatAccountSchema
export type AddFiatAccountRequestParams = {
  fiatAccountSchema: FiatAccountSchema
}

// Path parameters for DELETE /accounnt/:fiatAccountId
export type DeleteFiatAccountRequestParams = {
  fiatAccountId: FiatAccountId
}

// Response body for GET /accounts/:fiatAccountSchema
export type GetFiatAccountsResponse = Record<
  FiatAccountType,
  ObfuscatedFiatAccountData[]
  >

// Response body for POST /accounts/:fiatAccountSchema
export type AddFiatAccountResponse = ObfuscatedFiatAccountData

// Helper type. Generic representation of a fiat account, with personal information stripped.
export type ObfuscatedFiatAccountData = {
  fiatAccountId: string
  name: string
  institution: string
  fiatAccountType: FiatAccountType
}

/*
/ Transfer Endpoint Types
*/

// Request body for POST /transfer/in and POST /transfer/out
export type TransferRequestBody = {
  fiatType: FiatType
  cryptoType: CryptoType
  amount: string
  fiatAccountId: string
}

// Response body for POST /transfer/in and POST /transfer/out
export type TransferResponse = {
  transferId: string
  transferStatus: TransferStatus
  transferAddress: string
}

// Path parameters for GET /transfer/:transferId/status
export type TransferStatusRequestParams = {
  transferId: string
}

// Response body for GET /transfer/:transferId/status
export type TransferStatusResponse = {
  status: TransferStatus
  transferType: TransferType
  fiatType: FiatType
  cryptoType: CryptoType
  amountProvided: string
  amountReceived: string
  fee?: string
  fiatAccountId: string
}

/*
 * FiatConnect static type definitions.
 */

export type FiatAccountId = string

export enum TransferType {
  TransferIn = 'TransferIn',
  TransferOut = 'TransferOut',
}

export enum TransferStatus {
  TransferStarted = 'TransferStarted',
  TransferPending = 'TransferPending',
  TransferComplete = 'TransferComplete',
  TransferFailed = 'TransferFailed',
}

export enum KycStatus {
  NotCreated = 'NotCreated',
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
  Expired = 'Expired',
}

export enum FeeType {
  KycFee = 'KycFee',
  PlatformFee = 'PlatformFee',
}

export enum FeeFrequency {
  OneTime = 'OneTime',
  Recurring = 'Recurring',
}

// Types for request bodies sent from FiatConnect webhooks
export enum WebhookEventType {
  KycStatusEvent = 'KycStatusEvent',
  TransferInStatusEvent = 'TransferInStatusEvent',
  TransferOutStatusEvent = 'TransferOutStatusEvent',
}

export type WebhookRequestBody = {
  eventType: WebhookEventType
  provider: string
  eventId: string
  accountAddress: string
}

export type WebhookKycStatusRequestBody = WebhookRequestBody & {
  payload: {
    kycSchema: KycSchema
    kycStatus: KycStatus
  }
}

export type WebhookTransferInStatusRequestBody = WebhookRequestBody & {
  payload: TransferStatusResponse
}

export type WebhookTransferOutStatusRequestBody =
  WebhookTransferInStatusRequestBody

// Errors returned by FiatConnect endpoints
export enum FiatConnectError {
  GeoNotSupported = 'GeoNotSupported',
  CryptoAmountTooLow = 'CryptoAmountTooLow',
  CryptoAmountTooHigh = 'CryptoAmountTooHigh',
  FiatAmountTooLow = 'FiatAmountTooLow',
  FiatAmountTooHigh = 'FiatAmountTooHigh',
  CryptoNotSupported = 'CryptoNotSupported',
  FiatNotSupported = 'FiatNotSupported',
  UnsupportedSchema = 'UnsupportedSchema',
  InvalidSchema = 'InvalidSchema',
  ResourceExists = 'ResourceExists',
  ResourceNotFound = 'ResourceNotFound',
  TransferNotAllowed = 'TransferNotAllowed',
  KycExpired = 'KycExpired',
}

/*
 * FiatConnect dynamic type definitions.
 *
 * The following types contain information about currencies, tokens, KYC information, and Fiat Account information
 * that are currently supported by payment providers. The types can be added to via a pull request to the FiatConnect
 * specification repo -- for example, when support for a new currency or account type is added.
 *
 * Any interfaces/enum values prefixed with `Mock` are not officially supported by the FiatConnect specification,
 * and are only included here as examples.
 */

export enum FiatType {
  USD = 'USD',
  EUR = 'EUR',
}

export enum CryptoType {
  cUSD = 'cUSD',
  cEUR = 'cEUR',
  CELO = 'CELO',
}

export enum KycSchema {
  MockNameAndAddress = 'MockNameAndAddress',
}

export enum FiatAccountSchema {
  MockCheckingAccount = 'MockCheckingAccount',
}

export enum FiatAccountType {
  MockCheckingAccount = 'MockCheckingAccount',
  MockDebitCard = 'MockDebitCard',
  MockCreditCard = 'MockCreditCard',
}

export interface MockCheckingAccount {
  bankName: string
  accountName: string
  fiatType: FiatType
  accountNumber: string
  routingNumber: string
}

export interface MockNameAndAddressKyc {
  firstName: string
  lastName: string
  address: PostalAddress
}

export interface PostalAddress {
  address1: string
  address2?: string
  city: string
  region: string // in the US this means state
  postalCode: string
  isoCountryCode: string
}
