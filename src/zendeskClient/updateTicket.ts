import("isomorphic-fetch");

import { getErrorMessage } from "../utils";
import {
  ZENDESK_API_PASSWORD,
  ZENDESK_API_URL,
  ZENDESK_API_USER,
} from "../constants";
import type { CreatedTicket } from "../types";

export default async function updateTicket(ticket: CreatedTicket) {
  try {
    const endpoint = ZENDESK_API_URL + "/tickets" + ticket.id + ".json";
    const response = await fetch(endpoint, {
      body: JSON.stringify(ticket),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_PASSWORD}`).toString(
            "base64",
          ),
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(
      `Something when wrong when updating this ticket '${
        ticket.id
      }': ${getErrorMessage(e)}`,
    );
    return null;
  }
}
