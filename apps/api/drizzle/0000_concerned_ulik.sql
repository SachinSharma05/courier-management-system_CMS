CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"role" varchar(50),
	"client_id" integer,
	"action" varchar(100) NOT NULL,
	"entity" varchar(100),
	"entity_id" varchar(100),
	"payload" jsonb,
	"ip_address" varchar(45),
	"user_agent" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_credentials" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"env_key" varchar(100) NOT NULL,
	"encrypted_value" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_credential_entry" UNIQUE("client_id","provider_id","env_key")
);
--> statement-breakpoint
CREATE TABLE "client_limits" (
	"client_id" integer PRIMARY KEY NOT NULL,
	"max_requests_per_minute" integer DEFAULT 60 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaints" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"awb" varchar(50) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" integer NOT NULL,
	"provider" varchar(30) NOT NULL,
	"awb" varchar(50) NOT NULL,
	"reference_number" varchar(100),
	"service_type" varchar(30),
	"payment_mode" varchar(20),
	"cod_amount" numeric(12, 2),
	"origin_pincode" varchar(10),
	"destination_pincode" varchar(10),
	"origin" text,
	"destination" text,
	"length_cm" integer,
	"breadth_cm" integer,
	"height_cm" integer,
	"weight_g" integer,
	"chargeable_weight_g" integer,
	"estimated_cost" numeric(12, 2),
	"invoice_amount" numeric(12, 2),
	"current_status" varchar(100),
	"expected_delivery_date" timestamp,
	"booked_at" timestamp,
	"last_status_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "consignments_awb_unique" UNIQUE("awb")
);
--> statement-breakpoint
CREATE TABLE "provider_shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consignment_id" uuid NOT NULL,
	"provider" varchar(30) NOT NULL,
	"provider_order_id" varchar(100),
	"provider_tracking_id" varchar(100),
	"provider_awb" varchar(50),
	"provider_cawb" varchar(50),
	"label_url" text,
	"manifest_url" text,
	"pod_url" text,
	"raw_request" jsonb,
	"raw_response" jsonb,
	"last_synced_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(50) NOT NULL,
	"name" varchar(150) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "providers_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "rate_card_slabs" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate_card_id" integer NOT NULL,
	"zone_code" varchar(10) NOT NULL,
	"slab_type" varchar(30) NOT NULL,
	"min_weight_g" integer,
	"max_weight_g" integer,
	"rate" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_card_zones" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate_card_id" integer NOT NULL,
	"zone_code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"service_type" varchar(30) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"effective_from" date DEFAULT now() NOT NULL,
	"effective_to" date,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"consignment_id" uuid NOT NULL,
	"provider" varchar(30) NOT NULL,
	"awb" varchar(50) NOT NULL,
	"status" varchar(100),
	"location" varchar(200),
	"remarks" text,
	"event_time" timestamp,
	"raw" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(150) NOT NULL,
	"email" varchar(254) NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'client' NOT NULL,
	"company_name" text,
	"company_address" text,
	"contact_person" text,
	"phone" text,
	"providers" json DEFAULT '[]'::json,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "provider_shipments" ADD CONSTRAINT "provider_shipments_consignment_id_consignments_id_fk" FOREIGN KEY ("consignment_id") REFERENCES "public"."consignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_card_slabs" ADD CONSTRAINT "rate_card_slabs_rate_card_id_rate_cards_id_fk" FOREIGN KEY ("rate_card_id") REFERENCES "public"."rate_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rate_card_zones" ADD CONSTRAINT "rate_card_zones_rate_card_id_rate_cards_id_fk" FOREIGN KEY ("rate_card_id") REFERENCES "public"."rate_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_consignment_id_consignments_id_fk" FOREIGN KEY ("consignment_id") REFERENCES "public"."consignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "consignments_client_id_idx" ON "consignments" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "consignments_client_provider_idx" ON "consignments" USING btree ("client_id","provider");--> statement-breakpoint
CREATE INDEX "consignments_status_idx" ON "consignments" USING btree ("current_status");--> statement-breakpoint
CREATE INDEX "consignments_created_at_idx" ON "consignments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "consignments_provider_idx" ON "consignments" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "provider_shipments_consignment_idx" ON "provider_shipments" USING btree ("consignment_id");--> statement-breakpoint
CREATE INDEX "provider_shipments_provider_idx" ON "provider_shipments" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "provider_shipments_last_synced_idx" ON "provider_shipments" USING btree ("last_synced_at");--> statement-breakpoint
CREATE INDEX "provider_shipments_provider_awb_idx" ON "provider_shipments" USING btree ("provider_awb");--> statement-breakpoint
CREATE INDEX "tracking_events_consignment_time_idx" ON "tracking_events" USING btree ("consignment_id","event_time");--> statement-breakpoint
CREATE INDEX "tracking_events_awb_idx" ON "tracking_events" USING btree ("awb");--> statement-breakpoint
CREATE INDEX "tracking_events_provider_idx" ON "tracking_events" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "tracking_events_created_at_idx" ON "tracking_events" USING btree ("created_at");