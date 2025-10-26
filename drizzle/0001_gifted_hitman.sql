CREATE TABLE `activity_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`resourceType` enum('post','pin','website','schedule'),
	`resourceId` int,
	`status` enum('success','failure') DEFAULT 'success',
	`message` text,
	`errorDetails` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_key_rotation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`keyIndex` int,
	`requestCount` int DEFAULT 0,
	`errorCount` int DEFAULT 0,
	`lastUsedAt` timestamp,
	`rateLimitReachedAt` timestamp,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `api_key_rotation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`excerpt` text,
	`ingredients` text,
	`instructions` text,
	`status` enum('pending','generating','generated','publishing','published','failed') DEFAULT 'pending',
	`wordpressPostId` varchar(100),
	`wordpressSiteId` int,
	`generatedAt` timestamp,
	`publishedAt` timestamp,
	`failureReason` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`blogPostId` int,
	`pinterestPinId` int,
	`scheduledFor` timestamp,
	`priority` int DEFAULT 0,
	`status` enum('queued','processing','completed','failed') DEFAULT 'queued',
	`retryCount` int DEFAULT 0,
	`lastError` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pinterest_pins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`blogPostId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` varchar(500),
	`imageKey` varchar(255),
	`status` enum('pending','generating','generated','uploading','uploaded','failed') DEFAULT 'pending',
	`pinterestPinId` varchar(100),
	`generatedAt` timestamp,
	`uploadedAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pinterest_pins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publishing_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postsPerDay` int DEFAULT 30,
	`pinsPerDay` int DEFAULT 30,
	`publishTime` varchar(10),
	`timezone` varchar(100) DEFAULT 'UTC',
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publishing_schedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wordpress_sites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`url` varchar(500) NOT NULL,
	`username` varchar(255) NOT NULL,
	`appPassword` text,
	`isActive` boolean DEFAULT true,
	`lastSyncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wordpress_sites_id` PRIMARY KEY(`id`)
);
