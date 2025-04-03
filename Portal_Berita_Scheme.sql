CREATE TABLE `User` (
  `id` uuid PRIMARY KEY,
  `name` string,
  `email` string UNIQUE,
  `password` string,
  `role` ENUM ('READER', 'REPORTER', 'EDITOR', 'ADMIN') DEFAULT 'READER',
  `created_at` datetime DEFAULT 'now()',
  `updated_at` datetime DEFAULT 'now()'
);

CREATE TABLE `Category` (
  `id` uuid PRIMARY KEY,
  `name` string UNIQUE,
  `description` text,
  `created_at` datetime DEFAULT 'now()',
  `updated_at` datetime DEFAULT 'now()'
);

CREATE TABLE `Article` (
  `id` uuid PRIMARY KEY,
  `title` string,
  `slug` string UNIQUE,
  `content` text,
  `image_url` string,
  `author_id` uuid,
  `category_id` uuid,
  `is_published` boolean,
  `published_at` datetime,
  `created_at` datetime DEFAULT 'now()',
  `updated_at` datetime DEFAULT 'now()'
);

CREATE TABLE `Comment` (
  `id` uuid PRIMARY KEY,
  `content` text,
  `user_id` uuid,
  `article_id` uuid,
  `created_at` datetime DEFAULT 'now()',
  `updated_at` datetime DEFAULT 'now()'
);

CREATE TABLE `Tag` (
  `id` uuid PRIMARY KEY,
  `name` string UNIQUE,
  `created_at` datetime DEFAULT 'now()',
  `updated_at` datetime DEFAULT 'now()'
);

CREATE TABLE `ArticleTag` (
  `id` uuid PRIMARY KEY,
  `article_id` uuid,
  `tag_id` uuid
);

CREATE TABLE `Like` (
  `id` uuid PRIMARY KEY,
  `user_id` uuid,
  `article_id` uuid,
  `created_at` datetime DEFAULT 'now()'
);

ALTER TABLE `Article` ADD FOREIGN KEY (`author_id`) REFERENCES `User` (`id`);

ALTER TABLE `Article` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`id`);

ALTER TABLE `Comment` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Comment` ADD FOREIGN KEY (`article_id`) REFERENCES `Article` (`id`);

ALTER TABLE `ArticleTag` ADD FOREIGN KEY (`article_id`) REFERENCES `Article` (`id`);

ALTER TABLE `ArticleTag` ADD FOREIGN KEY (`tag_id`) REFERENCES `Tag` (`id`);

ALTER TABLE `Like` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`id`);

ALTER TABLE `Like` ADD FOREIGN KEY (`article_id`) REFERENCES `Article` (`id`);
