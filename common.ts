export interface IRequest {
    id: string,
    name: string,
    params: any[]
    type: "MonnaRPC"
}

export type Method = (...args: any[]) => Promise<any>
export type MethodSecured = (user: any, ...args: any[]) => Promise<any>