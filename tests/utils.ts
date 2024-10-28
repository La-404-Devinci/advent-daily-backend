import request from "supertest";
import { Express } from "express";
import { IncomingHttpHeaders } from "http";

export const post = async (app: Express, url: string, body?: string | object, headers?: IncomingHttpHeaders) => {
    let res = request(app).post(url);
    if (headers) res = res.set(headers);
    return await res.send(body).expect("Content-Type", /json/);
};

export const get = async (
    app: Express,
    url: string,
    params?: Record<string, string | number>,
    query?: Record<string, string | number>,
    headers?: IncomingHttpHeaders
) => {
    let uri = url;

    if (params) uri = uri.replace(/:\w+/g, (match) => params[match.slice(1)].toString());
    if (query)
        uri =
            uri +
            "?" +
            Object.entries(query)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");

    let res = request(app).get(uri);
    if (headers) res = res.set(headers);
    return await res.expect("Content-Type", /json/);
};

export const put = async (
    app: Express,
    url: string,
    params?: Record<string, string | number>,
    body?: string | object,
    headers?: IncomingHttpHeaders
) => {
    let uri = url;

    if (params) uri = uri.replace(/:\w+/g, (match) => params[match.slice(1)].toString());

    let res = request(app).put(uri);
    if (headers) res = res.set(headers);
    return await res.send(body).expect("Content-Type", /json/);
};

export const del = async (
    app: Express,
    url: string,
    params?: Record<string, string | number>,
    headers?: IncomingHttpHeaders
) => {
    let uri = url;

    if (params) uri = uri.replace(/:\w+/g, (match) => params[match.slice(1)].toString());

    let res = request(app).delete(uri);
    if (headers) res = res.set(headers);
    return await res.expect("Content-Type", /json/);
};
