

import  api  from "../services/api";
import { Request } from "./RequestClass";

class GetRequest<T> extends Request<T> {
  async send(): Promise<T> {
    return this.handleRequest(async () => {
      const response = await api.get<T>(this.endpoint);
      return response.data;
    });
  }
}
export { GetRequest };
