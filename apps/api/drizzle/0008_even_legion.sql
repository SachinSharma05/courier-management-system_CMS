CREATE TABLE "pincodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(50) NOT NULL,
	"pincode" varchar(10) NOT NULL,
	"city" varchar(100),
	"state" varchar(100) NOT NULL,
	"cod_delivery" boolean DEFAULT false,
	"prepaid_delivery" boolean DEFAULT true,
	"pickup" boolean DEFAULT true,
	"zone_group" varchar(50),
	"zone_code" varchar(10),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pincodes_pincode_unique" UNIQUE("pincode")
);
