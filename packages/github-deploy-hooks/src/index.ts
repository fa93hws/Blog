/* eslint-disable no-console, import/no-default-export */
import { request, RequestOptions } from 'https';
import * as jwt from 'jsonwebtoken';

const APP_NAME = 's3-deploybot';
const HOSTNAME = 'api.github.com';

type Params = {
  commitHash: string;
  name: string;
  url: string;
};

function parseQueryStringParameter(query: Record<string, unknown>): Params {
  if (query.commitHash == null || typeof query.commitHash !== 'string') {
    throw new Error(`commitHash must be string, got ${query.commitHash}`);
  }
  if (query.url == null || typeof query.url !== 'string') {
    throw new Error(`url must be string, got ${query.url}`);
  }
  if (query.name == null || typeof query.name !== 'string') {
    throw new Error(`name must be string, got ${query.name}`);
  }
  return {
    commitHash: query.commitHash,
    url: query.url,
    name: query.name,
  };
}

function signJwt() {
  const privateKey = process.env.GITHUB_PRIVATE_KEY;
  if (typeof privateKey !== 'string') {
    throw new Error('private key must be string');
  }
  const payload = {
    iat: Math.floor(new Date().getTime() / 1000),
    exp: Math.floor(new Date().getTime() / 1000 + 60),
    iss: '55093',
  };
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

function makeRequest(
  options: RequestOptions,
  body: Record<string, string> | undefined,
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (body != null && options.headers != null) {
      // eslint-disable-next-line no-param-reassign
      options.headers['Content-Length'] = JSON.stringify(body).length;
    } else if (options.headers == null) {
      throw new Error('headers must not be empty');
    }
    const req = request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode == null) {
          console.error(res);
          return reject(new Error('statusCode is null'));
        }
        const replyBody = data;
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(
            new Error(`invalid statusCode ${res.statusCode}: ${replyBody}`),
          );
        }
        return resolve(replyBody);
      });
    });

    req.on('error', (error) => reject(error));

    body && req.write(JSON.stringify(body));
    req.end();
  });
}

function doAuth(token: string) {
  const options = {
    hostname: HOSTNAME,
    // installations can be found by querying /app/installations, using GET
    path: '/app/installations/6943584/access_tokens',
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.machine-man-preview+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': APP_NAME,
    },
  };
  return makeRequest(options, undefined);
}

function createCheck({ commitHash, url, name }: Params, token: string) {
  const options: RequestOptions = {
    hostname: 'api.github.com',
    path: '/repos/fa93hws/blog/check-runs',
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github.antiope-preview+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 's3-deploybot',
    },
  };
  const data = {
    name: `deploy: ${name}`,
    // eslint-disable-next-line @typescript-eslint/camelcase
    head_sha: commitHash,
    // eslint-disable-next-line @typescript-eslint/camelcase
    details_url: url,
    status: 'completed',
    conclusion: 'success',
  };
  return makeRequest(options, data);
}
// eslint-disable-next-line @typescript-eslint/camelcase
export default async function lambda_handler({
  queryStringParameters,
}: {
  queryStringParameters: Record<string, unknown>;
}) {
  try {
    const tokenForAuth = signJwt();
    const authResult = await doAuth(tokenForAuth);
    const { token: tokenForCheck } = JSON.parse(authResult);
    const params = parseQueryStringParameter(queryStringParameters);
    const result = await createCheck(params, tokenForCheck);
    console.log(result);
    const response = {
      statusCode: 200,
      body: JSON.stringify('Done'),
    };
    return response;
  } catch (e) {
    console.error(e);
    return { statusCode: 500 };
  }
}
