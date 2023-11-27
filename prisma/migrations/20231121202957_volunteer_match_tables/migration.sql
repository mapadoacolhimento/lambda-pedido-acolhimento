-- CreateTable
CREATE TABLE "public"."cities" (
    "city_id" SERIAL NOT NULL,
    "city_value" VARCHAR(100) NOT NULL,
    "city_label" VARCHAR(100) NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "ibge_code" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("city_id")
);

-- CreateTable
CREATE TABLE "public"."volunteer_availability" (
    "volunteer_id" INTEGER NOT NULL,
    "current_matches" INTEGER NOT NULL,
    "max_matches" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL,
    "support_type" VARCHAR(20) NOT NULL,
    "support_expertise" VARCHAR(100) NOT NULL,
    "offers_online_support" BOOLEAN NOT NULL,
    "lat" DECIMAL(10,4),
    "lng" DECIMAL(10,4),
    "city" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "volunteer_availability_pkey" PRIMARY KEY ("volunteer_id")
);

-- CreateTable
CREATE TABLE "public"."volunteer_status_history" (
    "id" BIGSERIAL NOT NULL,
    "volunteer_status" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "volunteer_id" INTEGER NOT NULL,

    CONSTRAINT "volunteer_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteer_status_history_volunteer_id_d1e0ea8c" ON "public"."volunteer_status_history"("volunteer_id");

-- AddForeignKey
ALTER TABLE "public"."volunteer_availability" ADD CONSTRAINT "volunteer_availability_volunteer_id_ff544bbb_fk_volunteers_id" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."volunteer_status_history" ADD CONSTRAINT "volunteer_status_history_volunteer_id_d1e0ea8c_fk_volunteers_id" FOREIGN KEY ("volunteer_id") REFERENCES "public"."volunteers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
