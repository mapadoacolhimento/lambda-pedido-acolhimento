-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "match";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."auth_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_group_permissions" (
    "id" BIGSERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content_type_id" INTEGER NOT NULL,
    "codename" VARCHAR(100) NOT NULL,

    CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_user" (
    "id" SERIAL NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "is_superuser" BOOLEAN NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_user_groups" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "auth_user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_user_user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "auth_user_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_formdata" (
    "id" BIGSERIAL NOT NULL,
    "type_form" VARCHAR(10) NOT NULL,
    "step" INTEGER NOT NULL,
    "values" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "total_steps" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "core_formdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."core_integrationlogs" (
    "id" BIGSERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "error" VARCHAR(200) NOT NULL,
    "data" JSONB NOT NULL,
    "form_data_id" BIGINT NOT NULL,
    "external_data" JSONB NOT NULL,
    "integration" VARCHAR(15) NOT NULL,

    CONSTRAINT "core_integrationlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_admin_log" (
    "id" SERIAL NOT NULL,
    "action_time" TIMESTAMPTZ(6) NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" SMALLINT NOT NULL,
    "change_message" TEXT NOT NULL,
    "content_type_id" INTEGER,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_content_type" (
    "id" SERIAL NOT NULL,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,

    CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_migrations" (
    "id" BIGSERIAL NOT NULL,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_session" (
    "session_key" VARCHAR(40) NOT NULL,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key")
);

-- CreateTable
CREATE TABLE "public"."integrations_logs" (
    "id" BIGSERIAL NOT NULL,
    "type" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "error" VARCHAR(200) NOT NULL,
    "data" JSONB NOT NULL,
    "integration" VARCHAR(15) NOT NULL,
    "external_id" INTEGER,
    "form_type" VARCHAR(15) NOT NULL,
    "internal_id" INTEGER,

    CONSTRAINT "volunteers_integrationlogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."msrs_formdata" (
    "id" BIGSERIAL NOT NULL,
    "stage" VARCHAR(20) NOT NULL,
    "values" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "msrs_formdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."msrs_msrs" (
    "id" BIGSERIAL NOT NULL,
    "user_zendesk_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "color" VARCHAR(15) NOT NULL,
    "gender" VARCHAR(15) NOT NULL,
    "whatsapp" VARCHAR(11) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10,4) NOT NULL,
    "logintude" DECIMAL(10,4) NOT NULL,
    "pcd" BOOLEAN NOT NULL,
    "education" VARCHAR(40) NOT NULL,
    "work_situation" VARCHAR(40) NOT NULL,
    "income" DECIMAL(10,2) NOT NULL,
    "duration_of_violence" VARCHAR(30) NOT NULL,
    "author_of_violence" VARCHAR(30) NOT NULL,
    "story" TEXT NOT NULL,
    "risk_factors" VARCHAR(140) NOT NULL,
    "protective_factors" VARCHAR(100) NOT NULL,
    "public_service" VARCHAR(100) NOT NULL,
    "type_of_support" VARCHAR(20) NOT NULL,
    "access" VARCHAR(30) NOT NULL,
    "status" VARCHAR(15) NOT NULL,
    "support_on_queue" BOOLEAN NOT NULL,
    "on_queue" BOOLEAN NOT NULL,
    "online" BOOLEAN NOT NULL,
    "priority" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "match" BOOLEAN NOT NULL,
    "digital_violence" VARCHAR(200) NOT NULL,
    "obstetric_violence" VARCHAR(100) NOT NULL,
    "physical_violence" VARCHAR(100) NOT NULL,
    "property_violence" VARCHAR(100) NOT NULL,
    "psych_violence" VARCHAR(100) NOT NULL,
    "sexual_violence" VARCHAR(100) NOT NULL,

    CONSTRAINT "msrs_msrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."solidarity_users" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "url" TEXT,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "time_zone" TEXT,
    "iana_time_zone" TEXT,
    "phone" TEXT,
    "shared_phone_number" BOOLEAN,
    "photo" JSONB,
    "locale_id" BIGINT,
    "locale" TEXT,
    "organization_id" BIGINT,
    "role" TEXT,
    "verified" BOOLEAN,
    "external_id" BIGINT,
    "tags" JSONB,
    "alias" TEXT,
    "active" BOOLEAN,
    "shared" BOOLEAN,
    "shared_agent" BOOLEAN,
    "last_login_at" TIMESTAMP(6),
    "two_factor_auth_enabled" BOOLEAN,
    "signature" TEXT,
    "details" TEXT,
    "notes" TEXT,
    "role_type" BIGINT,
    "custom_role_id" BIGINT,
    "moderator" BOOLEAN,
    "ticket_restriction" TEXT,
    "only_private_comments" BOOLEAN,
    "restricted_agent" BOOLEAN,
    "suspended" BOOLEAN,
    "chat_only" BOOLEAN,
    "default_group_id" BIGINT,
    "report_csv" BOOLEAN,
    "user_fields" JSONB,
    "address" TEXT,
    "atendimentos_concludos_calculado_" BIGINT,
    "atendimentos_concluidos" BIGINT,
    "atendimentos_em_andamento" BIGINT,
    "atendimentos_em_andamento_calculado_" BIGINT,
    "cep" TEXT,
    "city" TEXT,
    "condition" TEXT,
    "cor" TEXT,
    "data_de_inscricao_no_bonde" TIMESTAMP(6),
    "disponibilidade_de_atendimentos" TEXT,
    "encaminhamentos" BIGINT,
    "encaminhamentos_realizados_calculado_" BIGINT,
    "latitude" TEXT,
    "longitude" TEXT,
    "occupation_area" TEXT,
    "registration_number" TEXT,
    "state" TEXT,
    "tipo_de_acolhimento" TEXT,
    "ultima_atualizacao_de_dados" TIMESTAMP(6),
    "whatsapp" TEXT,
    "permanently_deleted" BOOLEAN,

    CONSTRAINT "solidarity_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."volunteers" (
    "id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "condition" VARCHAR(30) NOT NULL,
    "first_name" VARCHAR(200) NOT NULL,
    "last_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "phone" VARCHAR(11) NOT NULL,
    "whatsapp" VARCHAR(11) NOT NULL,
    "zipcode" VARCHAR(9) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(10,4),
    "logintude" DECIMAL(10,4),
    "register_number" VARCHAR(11) NOT NULL,
    "birth_date" TIMESTAMPTZ(6) NOT NULL,
    "color" VARCHAR(100) NOT NULL,
    "gender" VARCHAR(100) NOT NULL,
    "modality" VARCHAR(100) NOT NULL,
    "fields_of_work" VARCHAR(200) NOT NULL,
    "years_of_experience" VARCHAR(100) NOT NULL,
    "aviability" VARCHAR(100) NOT NULL,
    "approach" VARCHAR(100),
    "form_data_id" BIGINT,
    "ocuppation" VARCHAR(10) NOT NULL,

    CONSTRAINT "volunteers_volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."volunteers_formdata" (
    "id" BIGSERIAL NOT NULL,
    "type_form" VARCHAR(10) NOT NULL,
    "step" INTEGER NOT NULL,
    "values" JSONB NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "total_steps" INTEGER NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "volunteers_formdata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_name_key" ON "public"."auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_name_a6ea08ec_like" ON "public"."auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "public"."auth_group_permissions"("group_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "public"."auth_group_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "public"."auth_group_permissions"("group_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "public"."auth_permission"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "public"."auth_permission"("content_type_id", "codename");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_username_key" ON "public"."auth_user"("username");

-- CreateIndex
CREATE INDEX "auth_user_username_6821ab7c_like" ON "public"."auth_user"("username");

-- CreateIndex
CREATE INDEX "auth_user_groups_group_id_97559544" ON "public"."auth_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "auth_user_groups_user_id_6a12ed8b" ON "public"."auth_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_groups_user_id_group_id_94350c0c_uniq" ON "public"."auth_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_permission_id_1fbb5f2c" ON "public"."auth_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "auth_user_user_permissions_user_id_a95ead1b" ON "public"."auth_user_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_user_permissions_user_id_permission_id_14a6b632_uniq" ON "public"."auth_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "core_formdata_user_id_key" ON "public"."core_formdata"("user_id");

-- CreateIndex
CREATE INDEX "core_integrationlogs_form_data_id_3bdb0c69" ON "public"."core_integrationlogs"("form_data_id");

-- CreateIndex
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "public"."django_admin_log"("content_type_id");

-- CreateIndex
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "public"."django_admin_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "public"."django_content_type"("app_label", "model");

-- CreateIndex
CREATE INDEX "django_session_expire_date_a5c62663" ON "public"."django_session"("expire_date");

-- CreateIndex
CREATE INDEX "django_session_session_key_c0390e0f_like" ON "public"."django_session"("session_key");

-- CreateIndex
CREATE UNIQUE INDEX "solidarity_users_user_id_key" ON "public"."solidarity_users"("user_id");

-- CreateIndex
CREATE INDEX "volunteers_volunteer_form_data_id_ec6c5a18" ON "public"."volunteers"("form_data_id");

-- CreateIndex
CREATE UNIQUE INDEX "volunteers_formdata_user_id_key" ON "public"."volunteers_formdata"("user_id");

-- AddForeignKey
ALTER TABLE "public"."auth_group_permissions" ADD CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_user_groups" ADD CONSTRAINT "auth_user_groups_group_id_97559544_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_user_groups" ADD CONSTRAINT "auth_user_groups_user_id_6a12ed8b_fk_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_user_user_permissions" ADD CONSTRAINT "auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."core_formdata" ADD CONSTRAINT "core_formdata_user_id_3a7f140c_fk_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."core_integrationlogs" ADD CONSTRAINT "core_integrationlogs_form_data_id_3bdb0c69_fk_core_formdata_id" FOREIGN KEY ("form_data_id") REFERENCES "public"."core_formdata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteers" ADD CONSTRAINT "volunteers_volunteer_form_data_id_ec6c5a18_fk_volunteer" FOREIGN KEY ("form_data_id") REFERENCES "public"."volunteers_formdata"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteers_formdata" ADD CONSTRAINT "volunteers_formdata_user_id_c9262138_fk_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

