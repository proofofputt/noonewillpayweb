CREATE TABLE "allocation_points_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"points" integer NOT NULL,
	"source" varchar(100) NOT NULL,
	"source_id" uuid,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_phone" varchar(50),
	"address" text,
	"category" varchar(100) NOT NULL,
	"region" varchar(50) NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "business_partners_contact_email_unique" UNIQUE("contact_email")
);
--> statement-breakpoint
CREATE TABLE "charity_pool" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"claim_code" varchar(50) NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by" uuid,
	"claimed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "charity_pool_claim_code_unique" UNIQUE("claim_code")
);
--> statement-breakpoint
CREATE TABLE "marketplace_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"package_name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"regular_price" numeric(10, 2) NOT NULL,
	"mates_price" numeric(10, 2) NOT NULL,
	"generates_charity" boolean DEFAULT true NOT NULL,
	"charity_threshold" integer DEFAULT 5 NOT NULL,
	"charity_counter" integer DEFAULT 0 NOT NULL,
	"max_redemptions" integer,
	"current_redemptions" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "package_purchases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"package_id" uuid NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"purchase_price" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_tx_id" text,
	"redemption_code" varchar(50) NOT NULL,
	"redeemed" boolean DEFAULT false NOT NULL,
	"redeemed_at" timestamp,
	"contributes_to_charity" boolean DEFAULT true NOT NULL,
	"allocation_points_earned" integer DEFAULT 25 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "package_purchases_redemption_code_unique" UNIQUE("redemption_code")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" uuid NOT NULL,
	"referred_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"points_earned" integer DEFAULT 50 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "survey_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"region" varchar(20) NOT NULL,
	"on_camera" boolean DEFAULT false NOT NULL,
	"newsletter" boolean DEFAULT true NOT NULL,
	"answers" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"referral_code" varchar(20) NOT NULL,
	"referred_by_code" varchar(20),
	"allocation_points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD CONSTRAINT "allocation_points_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charity_pool" ADD CONSTRAINT "charity_pool_package_id_marketplace_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."marketplace_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charity_pool" ADD CONSTRAINT "charity_pool_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_purchases" ADD CONSTRAINT "package_purchases_package_id_marketplace_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."marketplace_packages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "package_purchases" ADD CONSTRAINT "package_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_users_id_fk" FOREIGN KEY ("referred_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;