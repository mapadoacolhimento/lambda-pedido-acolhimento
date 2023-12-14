export type Ticket = {
  requester_id: number;
};

export type CreatedTicket = Ticket & {
  id: number;
};
