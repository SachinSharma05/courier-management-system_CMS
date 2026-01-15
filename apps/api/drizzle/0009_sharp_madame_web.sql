CREATE TABLE "zone_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"service_type" varchar(30) NOT NULL,
	"origin_group" varchar(50) NOT NULL,
	"destination_group" varchar(50) NOT NULL,
	"zone_code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
