

import  api  from "../services/api";
import { Request } from "./RequestClass";

class PostRequest<T> extends Request<T> {
  async send(): Promise<T> {
    return this.handleRequest(async () => {
      const response = await api.post<T>(this.endpoint, this.data);
      return response.data;
    });
  }
}
export { PostRequest };
