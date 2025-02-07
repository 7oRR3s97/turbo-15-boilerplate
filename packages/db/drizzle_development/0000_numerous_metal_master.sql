CREATE TYPE "public"."userRole" AS ENUM('MEMBER', 'ADMIN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "boilerplate_development_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_passwordResetToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "boilerplate_development_passwordResetToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_twoFactorConfirmation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_twoFactorToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "boilerplate_development_twoFactorToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"emailVerified" timestamp,
	"image" text,
	"role" "userRole" DEFAULT 'MEMBER' NOT NULL,
	"isTwoFactorEnabled" boolean DEFAULT false NOT NULL,
	"stripeCustomerId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "boilerplate_development_verificationToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "boilerplate_development_verificationToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boilerplate_development_account" ADD CONSTRAINT "boilerplate_development_account_userId_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boilerplate_development_session" ADD CONSTRAINT "boilerplate_development_session_userId_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "boilerplate_development_twoFactorConfirmation" ADD CONSTRAINT "boilerplate_development_twoFactorConfirmation_userId_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
