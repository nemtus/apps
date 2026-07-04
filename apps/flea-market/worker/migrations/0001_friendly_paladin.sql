CREATE TABLE `user_profile` (
	`user_id` text PRIMARY KEY NOT NULL,
	`phone_number` text,
	`zip_code` text,
	`address1` text,
	`address2` text,
	`symbol_address` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
