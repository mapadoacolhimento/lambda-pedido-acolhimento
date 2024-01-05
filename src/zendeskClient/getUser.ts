import("isomorphic-fetch");

import { getErrorMessage } from "../utils";
import {
  ZENDESK_API_TOKEN,
  ZENDESK_API_URL,
  ZENDESK_API_USER,
} from "../constants";
import type { ZendeskUser, ZendeskUserRes } from "../types";

export default async function getUser(
  userId: bigint
): Promise<ZendeskUser | null> {
  try {
    const endpoint = ZENDESK_API_URL + "/users/" + userId.toString() + ".json";
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString(
            "base64"
          ),
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as ZendeskUserRes;

    return data.user;
  } catch (e) {
    console.error(
      `[getUser] - Something went wrong when fetching this user from Zendesk '${userId}': ${getErrorMessage(
        e
      )}`
    );
    return null;
  }
}
