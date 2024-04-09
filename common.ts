export type Method = (...args: any[]) => Promise<any>
export type MethodSecured = (user: any, ...args: any[]) => Promise<any>