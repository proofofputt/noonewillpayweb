CREATE TABLE "culture_club_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pizzeria_id" uuid,
	"order_id" uuid,
	"content" text NOT NULL,
	"image_urls" text,
	"rating" integer,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"share_count" integer DEFAULT 0 NOT NULL,
	"reported" boolean DEFAULT false NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'attending' NOT NULL,
	"checked_in" boolean DEFAULT false NOT NULL,
	"checked_in_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_buys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pizzeria_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"target_amount" numeric(10, 2) NOT NULL,
	"current_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"participant_count" integer DEFAULT 0 NOT NULL,
	"max_participants" integer,
	"discount_percent" numeric(5, 2) NOT NULL,
	"deadline" timestamp NOT NULL,
	"pickup_time" timestamp,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"activated_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pizza_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pizzeria_id" uuid,
	"creator_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"event_type" varchar(50) NOT NULL,
	"image_url" text,
	"location_name" varchar(255),
	"address" text,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"max_attendees" integer,
	"current_attendees" integer DEFAULT 0 NOT NULL,
	"requires_rsvp" boolean DEFAULT true NOT NULL,
	"status" varchar(20) DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pizza_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pizzeria_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"group_buy_id" uuid,
	"order_type" varchar(20) NOT NULL,
	"items" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"discount" numeric(10, 2) DEFAULT '0.00',
	"final_amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payment_tx_id" text,
	"paid_at" timestamp,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"pickup_time" timestamp,
	"delivery_address" text,
	"fulfillment_code" varchar(20) NOT NULL,
	"fulfilled_at" timestamp,
	"contributes_to_treasury" boolean DEFAULT false NOT NULL,
	"treasury_slices_generated" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pizza_orders_fulfillment_code_unique" UNIQUE("fulfillment_code")
);
--> statement-breakpoint
CREATE TABLE "pizza_treasury" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pizzeria_id" uuid NOT NULL,
	"funded_by_order_id" uuid,
	"funded_by_user_id" uuid,
	"item_type" varchar(20) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by_user_id" uuid,
	"claim_code" varchar(20),
	"claimed_at" timestamp,
	"redeemed_at" timestamp,
	"expires_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pizza_treasury_claim_code_unique" UNIQUE("claim_code")
);
--> statement-breakpoint
CREATE TABLE "pizzeria_affiliates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pizzeria_id" uuid NOT NULL,
	"referral_code" varchar(20) NOT NULL,
	"orders_generated" integer DEFAULT 0 NOT NULL,
	"total_revenue" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"commission_percent" numeric(5, 2) DEFAULT '10.00' NOT NULL,
	"total_commission_earned" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"commission_paid" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pizzeria_affiliates_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "pizzerias" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"address" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50),
	"zip_code" varchar(20),
	"country" varchar(100) DEFAULT 'USA' NOT NULL,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(255),
	"hours" text,
	"accepts_bitcoin" boolean DEFAULT false NOT NULL,
	"accepts_lightning" boolean DEFAULT false NOT NULL,
	"lightning_address" varchar(255),
	"bitcoin_address" varchar(255),
	"image_url" text,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"total_orders" integer DEFAULT 0 NOT NULL,
	"treasury_slices_available" integer DEFAULT 0 NOT NULL,
	"treasury_pies_available" integer DEFAULT 0 NOT NULL,
	"owner_id" uuid,
	"verified" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sticker_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20) NOT NULL,
	"claimed" boolean DEFAULT false NOT NULL,
	"claimed_by" uuid,
	"claimed_by_survey" uuid,
	"claimed_at" timestamp,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"batch_id" varchar(50),
	"notes" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sticker_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "allocation_points_history" ALTER COLUMN "points" SET DATA TYPE numeric(10, 3);--> statement-breakpoint
ALTER TABLE "referrals" ALTER COLUMN "referred_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "referrals" ALTER COLUMN "points_earned" SET DATA TYPE numeric(10, 3);--> statement-breakpoint
ALTER TABLE "referrals" ALTER COLUMN "points_earned" SET DEFAULT '21.000';--> statement-breakpoint
ALTER TABLE "survey_responses" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_responses" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "allocation_points" SET DATA TYPE numeric(12, 3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "allocation_points" SET DEFAULT '0.000';--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "point_type" varchar(50);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "referral_code" varchar(20);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "referral_level" integer;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "referred_user_id" uuid;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "quiz_type" varchar(20);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "quiz_question_id" varchar(10);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "quiz_correct" boolean;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "created_by" varchar(50);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "verified" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "verified_by" uuid;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "reversed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "reversed_at" timestamp;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "reversed_by" uuid;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "reversal_reason" text;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD COLUMN "reversal_transaction_id" uuid;--> statement-breakpoint
ALTER TABLE "referrals" ADD COLUMN "referred_survey_id" uuid;--> statement-breakpoint
ALTER TABLE "referrals" ADD COLUMN "referral_level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "quick_quiz_score" integer;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "quick_quiz_questions" text;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "full_assessment_score" integer;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "full_assessment_completed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "full_assessment_completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "referral_code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "referred_by" varchar(20);--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "ip_address" varchar(45);--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "user_agent" text;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "submitted_by" uuid;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "is_admin_submission" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "registration_bonus_awarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_decade" varchar(20);--> statement-breakpoint
ALTER TABLE "culture_club_posts" ADD CONSTRAINT "culture_club_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "culture_club_posts" ADD CONSTRAINT "culture_club_posts_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "culture_club_posts" ADD CONSTRAINT "culture_club_posts_order_id_pizza_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."pizza_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_pizza_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."pizza_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_buys" ADD CONSTRAINT "group_buys_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_buys" ADD CONSTRAINT "group_buys_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_events" ADD CONSTRAINT "pizza_events_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_events" ADD CONSTRAINT "pizza_events_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_orders" ADD CONSTRAINT "pizza_orders_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_orders" ADD CONSTRAINT "pizza_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_orders" ADD CONSTRAINT "pizza_orders_group_buy_id_group_buys_id_fk" FOREIGN KEY ("group_buy_id") REFERENCES "public"."group_buys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_treasury" ADD CONSTRAINT "pizza_treasury_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_treasury" ADD CONSTRAINT "pizza_treasury_funded_by_order_id_pizza_orders_id_fk" FOREIGN KEY ("funded_by_order_id") REFERENCES "public"."pizza_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_treasury" ADD CONSTRAINT "pizza_treasury_funded_by_user_id_users_id_fk" FOREIGN KEY ("funded_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizza_treasury" ADD CONSTRAINT "pizza_treasury_claimed_by_user_id_users_id_fk" FOREIGN KEY ("claimed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizzeria_affiliates" ADD CONSTRAINT "pizzeria_affiliates_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizzeria_affiliates" ADD CONSTRAINT "pizzeria_affiliates_pizzeria_id_pizzerias_id_fk" FOREIGN KEY ("pizzeria_id") REFERENCES "public"."pizzerias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pizzerias" ADD CONSTRAINT "pizzerias_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_culture_club_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."culture_club_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_culture_club_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."culture_club_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sticker_codes" ADD CONSTRAINT "sticker_codes_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sticker_codes" ADD CONSTRAINT "sticker_codes_claimed_by_survey_survey_responses_id_fk" FOREIGN KEY ("claimed_by_survey") REFERENCES "public"."survey_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD CONSTRAINT "allocation_points_history_referred_user_id_users_id_fk" FOREIGN KEY ("referred_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD CONSTRAINT "allocation_points_history_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_points_history" ADD CONSTRAINT "allocation_points_history_reversed_by_users_id_fk" FOREIGN KEY ("reversed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_survey_id_survey_responses_id_fk" FOREIGN KEY ("referred_survey_id") REFERENCES "public"."survey_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_referral_code_unique" UNIQUE("referral_code");