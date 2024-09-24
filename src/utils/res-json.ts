import { Response } from "express";

export default {
    success: (res: Response, details: [statusCode: number, message?: string | null, payload?: any]): Response<any, Record<string, unknown>> => {
        const responseData = { status: "success" };
        details[1] ? responseData["message"] = details[1] : responseData["message"] = "Request was successful!";
        if (details[2]) responseData["payload"] = details[2];
        return res.status(details[0]).json(responseData);
    },
    error: (res: Response, details: [statusCode: number, message?: string, payload?: any]): Response<any, Record<string, unknown>> => {
        const responseData = { status: "error" };
        details[1] ? responseData["message"] = details[1] : responseData["message"] = "Request failed with an error!";
        if (details[2]) responseData["payload"] = details[2];
        return res.status(details[0]).json(responseData);
    },
    status: (res: Response, details: [statusCode: number, status: string, message?: string, payload?: any]): Response<any, Record<string, unknown>> => {
        const responseData = { status: details[1] };
        details[2] ? responseData["message"] = details[2] : responseData["message"] = details[1] === "success" ? "Request was successful!" : "Request failed with an error!";
        if (details[3]) responseData["payload"] = details[3];
        return res.status(details[0]).json(responseData);
    }
};
