import("isomorphic-fetch");

import { getErrorMessage, stringfyBigInt } from "../utils";
import {
  ZENDESK_API_TOKEN,
  ZENDESK_API_URL,
  ZENDESK_API_USER,
} from "../constants";
import type {
  CreateZendeskTicket,
  ZendeskTicket,
  ZendeskTicketRes,
} from "../types";

export default async function createTicket(
  ticket: CreateZendeskTicket
): Promise<ZendeskTicket | null> {
  try {
    const endpoint = ZENDESK_API_URL + "/tickets.json";

    const response = await fetch(endpoint, {
      body: JSON.stringify({ ticket: stringfyBigInt(ticket) }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(`${ZENDESK_API_USER}:${ZENDESK_API_TOKEN}`).toString(
            "base64"
          ),
      },
    });

    if (response.status !== 201 || !response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as ZendeskTicketRes;

    return data.ticket;
  } catch (e) {
    console.log(
      `Something went wrong when creating a ticket for this user '${ticket.requester_id.toString()}': ${getErrorMessage(
        e
      )}`
    );
    return null;
  }
}
