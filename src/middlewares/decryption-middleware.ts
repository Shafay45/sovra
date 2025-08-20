import { AES, enc } from "crypto-js";
import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";

export const decryptionMiddleware = async (ctx: Context, next: Next) => {
  try {
    const body: any = ctx.req.json();
    const secretKey = process.env.SECRET_KEY!;

    if (!body) throw "Bad request";

    const decryptedBody = AES.decrypt(body!.data, secretKey);

    const decryptedString = decryptedBody.toString(enc.Utf8);

    if (!decryptedString) throw "Failed to decrypt data";

    const decryptedObj = tryParse(decryptedString) ?? decryptedString;

    ctx.req.json = async () => decryptedObj;

    await next();
  } catch (error: any) {
    throw new HTTPException(400, { message: error?.message ?? error });
  }
};

function tryParse(jsonString: string) {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (error) {
    throw "Bad request";
  }
}
