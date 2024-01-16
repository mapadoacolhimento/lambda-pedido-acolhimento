import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const MSR_ZENDESK_USER_ID = 401191540912;
  const THERAPIST_ZENDESK_USER_ID = 417544904932;
  const LAWYER_ZENDESK_USER_ID = 423092711812;
  // const PSYCHOLOGICAL_ZENDESK_TICKET_ID = 25774;
  // const LEGAL_ZENDESK_TICKET_ID = 25776;

  const therapistVolunteer = await prisma.volunteers.create({
    data: {
      condition: "disponivel",
      firstName: "Teste Psi",
      last_name: "Local",
      email: "dev.psi.mapa@gmail.com",
      phone: "11911991199",
      zipcode: "01303020",
      state: "SP",
      city: "SAO PAULO",
      neighborhood: "Centro",
      latitude: -23.55242,
      longitude: -46.65735,
      registrationNumber: "123123123",
      birth_date: new Date("1999-01-02"),
      color: "black",
      gender: "cis_female",
      modality: "not_found",
      fields_of_work: "not_found",
      years_of_experience: "5_ou_mais",
      approach: "not_found",
      occupation: "psychologist",
      moodle_id: null,
      form_entries_id: null,
      zendeskUserId: THERAPIST_ZENDESK_USER_ID,
      availability: 3,
      offers_libras_support: true,
      street: "Rua da Consolação",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  const therapistVolunteerAvailability =
    await prisma.volunteerAvailability.create({
      data: {
        volunteer_id: therapistVolunteer.id,
        current_matches: 0,
        max_matches: 3,
        is_available: true,
        support_type: "psychological",
        support_expertise: "not_found",
        offers_online_support: true,
        lat: -23.55242,
        lng: -46.65735,
        city: "SAO PAULO",
        state: "SP",
        offers_libras_support: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  const lawyerVolunteer = await prisma.volunteers.create({
    data: {
      condition: "disponivel",
      firstName: "Teste Advogada",
      last_name: "Local",
      email: "dev.adv.mapa@gmail.com",
      phone: "11911991199",
      zipcode: "01303020",
      state: "SP",
      city: "SAO PAULO",
      neighborhood: "Centro",
      latitude: -23.55242,
      longitude: -46.65735,
      registrationNumber: "123123123",
      birth_date: new Date("1999-01-02"),
      color: "black",
      gender: "cis_female",
      modality: "not_found",
      fields_of_work: "not_found",
      years_of_experience: "5_ou_mais",
      approach: "not_found",
      occupation: "lawyer",
      moodle_id: null,
      form_entries_id: null,
      zendeskUserId: LAWYER_ZENDESK_USER_ID,
      availability: 3,
      offers_libras_support: true,
      street: "Rua da Consolação",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  const lawyerVolunteerAvailability = await prisma.volunteerAvailability.create(
    {
      data: {
        volunteer_id: lawyerVolunteer.id,
        current_matches: 0,
        max_matches: 3,
        is_available: true,
        support_type: "legal",
        support_expertise: "not_found",
        offers_online_support: true,
        lat: -23.55242,
        lng: -46.65735,
        city: "SAO PAULO",
        state: "SP",
        offers_libras_support: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  );

  // use these payloads to send a support req to /compose endpoint
  // const psychologicalSupportRequest = await prisma.supportRequests.create({
  //   data: {
  //     msrId: MSR_ZENDESK_USER_ID,
  //     zendeskTicketId: PSYCHOLOGICAL_ZENDESK_TICKET_ID,
  //     supportType: "psychological",
  //     priority: null,
  //     supportExpertise: null,
  //     hasDisability: null,
  //     requiresLibras: null,
  //     acceptsOnlineSupport: true,
  //     lat: -23.55242,
  //     lng: -46.65735,
  //     city: "SAO PAULO",
  //     state: "SP",
  //     status: "open",
  //   },
  // });

  // const legalSupportRequest = await prisma.supportRequests.create({
  //   data: {
  //     msrId: MSR_ZENDESK_USER_ID,
  //     zendeskTicketId: LEGAL_ZENDESK_TICKET_ID,
  //     supportType: "legal",
  //     priority: null,
  //     supportExpertise: null,
  //     hasDisability: null,
  //     requiresLibras: null,
  //     acceptsOnlineSupport: true,
  //     lat: -23.55242,
  //     lng: -46.65735,
  //     city: "SAO PAULO",
  //     state: "SP",
  //     status: "open",
  //   },
  // });

  const newMatchFeatureFlag = await prisma.featureFlag.create({
    data: {
      featureName: "NEW_MATCH",
      featureEnabled: true,
    },
  });

  const city = await prisma.cities.create({
    data: {
      city_value: "SAO PAULO",
      city_label: "SÃO PAULO",
      state: "SP",
      ibge_code: 123,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  console.log({
    therapistVolunteer,
    therapistVolunteerAvailability,
    lawyerVolunteer,
    lawyerVolunteerAvailability,
    newMatchFeatureFlag,
    city,
    // psychologicalSupportRequest,
    // legalSupportRequest,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
