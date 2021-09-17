// token module - tranfer asset
export const TransferAssetSchema = {
  "moduleID": 2,
  "moduleName": "token",
  "assetID": 0,
  "assetName": "transfer",
  "schema": {
    "$id": "lisk/transfer-asset",
    "title": "Transfer transaction asset",
    "type": "object",
    "required": [
      "amount",
      "recipientAddress",
      "data"
    ],
    "properties": {
      "amount": {
        "dataType": "uint64",
        "fieldNumber": 1
      },
      "recipientAddress": {
        "dataType": "bytes",
        "fieldNumber": 2,
        "minLength": 20,
        "maxLength": 20
      },
      "data": {
        "dataType": "string",
        "fieldNumber": 3,
        "minLength": 0,
        "maxLength": 64
      }
    }
  }
}
