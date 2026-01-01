ALTER TABLE "client_credentials" DROP CONSTRAINT "unique_credential_entry";--> statement-breakpoint
ALTER TABLE "client_credentials" ADD COLUMN "provider" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "client_credentials" DROP COLUMN "provider_id";--> statement-breakpoint
ALTER TABLE "client_credentials" ADD CONSTRAINT "unique_credential_entry" UNIQUE("client_id","provider","env_key");