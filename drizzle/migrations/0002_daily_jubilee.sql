ALTER TABLE "pizzerias" ADD COLUMN "referred_by_code" varchar(20);--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "referred_by_user_id" uuid;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "onboarding_status" varchar(20) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "payment_setup_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "api_integration_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "api_key" varchar(255);--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "webhook_url" text;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD COLUMN "pos_system" varchar(100);--> statement-breakpoint
ALTER TABLE "pizzerias" ADD CONSTRAINT "pizzerias_referred_by_user_id_users_id_fk" FOREIGN KEY ("referred_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;