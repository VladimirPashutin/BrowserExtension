import { ProtocolWithReturn } from "webext-bridge";

declare module "webext-bridge" {
    export interface ProtocolMap {
        // to specify the return type of the message,
        // use the `ProtocolWithReturn` type wrapper
        message: ProtocolWithReturn<Any, Any>;
    }
}