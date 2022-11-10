import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";
import { verify } from "jsonwebtoken";
import { createLogger } from "../../utils/logger";
import Axios from "axios";
import { JwtPayload } from "../../auth/JwtPayload";

const myLogger = createLogger("auth0Authorizer");
const jwksUrl =
  "https://dev-4ikc5lybrkey36cg.us.auth0.com/.well-known/jwks.json";

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  myLogger.info("Authorizing a user..", event.authorizationToken);
  try {
    const userId = await verifyToken(event.authorizationToken);
    myLogger.info("User authorized!", userId);
    return {
      principalId: userId.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    myLogger.error("User not authorized!", { error: e.message });
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  if (!authHeader) {
    throw new Error("No authentication header");
  }

  if (!authHeader.toLocaleLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid authentication header");
  }

  const token = getToken(authHeader);
  const certificate = await getCertificate(jwksUrl);

  if (!certificate) {
    throw new Error("Invalid certificate");
  }

  return verify(token, certificate, { algorithms: ["RS256"] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}

async function getCertificate(jwksUrl: string) {
  try {
    const response = await Axios.get(jwksUrl);
    const key = response["data"]["keys"][0]["x5c"][0];
    const cert = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`;
    return cert;
  } catch (error) {
    myLogger.error("Getting certificate failed", error);
  }
}
