export type ZendeskUser = {
  id: bigint;
  name: string;
};

export type ZendeskUserRes = {
  user: ZendeskUser;
};

export type ZendeskTicket = {
  id: bigint;
  requester_id: bigint;
};

export type UpdateZendeskTicket = Partial<Omit<ZendeskTicket, "id">> & {
  id: bigint;
};

export type CreateZendeskTicket = Omit<ZendeskTicket, "id">;

export type ZendeskTicketRes = {
  ticket: ZendeskTicket;
};
