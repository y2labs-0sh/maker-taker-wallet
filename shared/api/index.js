import apiCreator from 'api-creator'
import { ADMIN_API, SCAN_API } from 'constants/env'

const tokenFetcher = async () => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxZmIxMjkzNi1iZDQxLTQ5MjctOTdhMS1lYzQ0Y2EzZWJiMzMiLCJpYXQiOjE1NzM0Mzg2NjksImV4cCI6MTU3NDA0MzQ2OSwiYXVkIjpbImFwaSJdLCJpc3MiOiJodHRwczovL3d3dy51bmJhbmtpbmcuaW8ifQ._PVp5JlVL90frcKgDITFNOSbpsA5glmi5m1wmAp9KRk'
const responseTransformer = res => res.data
const errorTransformer = error => Promise.reject({ message: error.errorMsg })

export const riodefiApi = apiCreator(`${ADMIN_API}/api/v1`, { tokenFetcher, responseTransformer, errorTransformer })
export const riodefiScanApi = apiCreator(`${SCAN_API}/api/v1`, { responseTransformer })
