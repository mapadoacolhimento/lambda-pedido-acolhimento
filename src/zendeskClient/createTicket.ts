import("isomorphic-fetch");

import { getErrorMessage } from "../utils";
import {
  ZENDESK_API_TOKEN,
  ZENDESK_API_URL,
  ZENDESK_API_USER,
} from "../constants";
import type { Ticket } from "../types";

export default async function createTicket(ticket: Ticket) {
  try {
    const endpoint = ZENDESK_API_URL + "/tickets.json";
    const response = await fetch(endpoint, {
      body: JSON.stringify(ticket),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(
            `${ZENDESK_API_USER}/token:${ZENDESK_API_TOKEN}`,
          ).toString("base64"),
      },
    });

    if (response.status !== 201 || !response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(
      `Something went wrong when creating a ticket for this user '${
        ticket.requester_id
      }': ${getErrorMessage(e)}`,
    );
    return null;
  }
}
