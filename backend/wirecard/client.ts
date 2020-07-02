import {
  RESTDataSource,
  RequestOptions,
  HTTPCache
} from "apollo-datasource-rest";

export const BASE_URL = "https://sandbox.moip.com.br/v2/";
export const accessToken = "AMG3BBE1IGL4WIEWMU5MQCZXOSYFLCPB";
export const accessKey = "WBQ1RNEK8NJUCAQZ5RECC56BUC1YRRMKUAUUKYHD";

const base64 = (value: string) => {
  const buff = new Buffer(value);
  return buff.toString("base64");
};

export const authorizationHeader = `Basic ${base64(
  `${accessToken}:${accessKey}`
)}`;

export interface App {
  id: string;
  description: string;
  name: string;
  wesite: string;
  redirectUri: string;
  secret: string;
  accessToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewAppArgs {
  name: string;
  description: string;
  site: string;
  redirectUri: string;
}

export default class WirecardClient extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://sandbox.moip.com.br/v2/";
    this.httpCache = new HTTPCache();
  }

  willSendRequest(request: RequestOptions) {
    console.log(authorizationHeader);
    request.headers.set("Authorization", authorizationHeader);
  }

  async postApp(args: NewAppArgs) {
    console.log(args);
    return this.post("channels", args);
  }
}
