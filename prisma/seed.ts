import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();
async function main() {
  const passwordHash = await hash("12345678", 10);
  const users = await db.user.createMany({
    data: [
      {
        id: "user-1",
        fullName: "John Doe",
        email: "john@example.com",
        acceptedTOS: true,
        image:
          "https://www.shutterstock.com/shutterstock/photos/2423213779/display_1500/stock-photo-a-very-random-pose-of-asian-men-wearing-blue-t-shirts-on-a-gray-background-random-theme-2423213779.jpg",
        role: "ADMIN",

        emailVerified: new Date(),
      },
      {
        id: "user-2",
        fullName: "Jane Smith",
        acceptedTOS: true,
        image:
          "https://media-cdn.tripadvisor.com/media/photo-s/19/9c/93/21/random-pics.jpg",
        email: "jane@example.com",
        role: "REPORTER",

        emailVerified: new Date(),
      },
      {
        id: "user-3",
        fullName: "Alice Johnson",
        acceptedTOS: true,
        email: "alice@example.com",
        image:
          "https://media.istockphoto.com/id/1618846975/photo/smile-black-woman-and-hand-pointing-in-studio-for-news-deal-or-coming-soon-announcement-on.jpg?s=612x612&w=0&k=20&c=LUvvJu4sGaIry5WLXmfQV7RStbGG5hEQNo8hEFxZSGY=",
        role: "READER",

        emailVerified: new Date(),
      },
      {
        id: "user-4",
        fullName: "Bob Brown",
        email: "bob@example.com",
        acceptedTOS: true,
        image: "https://live.staticflickr.com/4097/4782981316_9cc563b3a5_c.jpg",
        role: "READER",
        emailVerified: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  const categories = await db.category.createMany({
    data: [
      { id: "cat-1", name: "Technology", description: "All about tech" },
      { id: "cat-2", name: "Health", description: "Health and wellness" },
    ],
    skipDuplicates: true,
  });
  const articles = await db.article.createMany({
    data: [
      {
        id: "article-1",
        title: "The Future of AI",
        slug: "future-of-ai",
        content: `<h1>AI is the future of technology</h1>`,
        image_url: "",
        author_id: "user-2",
        category_id: "cat-1",
        is_published: true,
        published_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
  const comments = await db.comment.create({
    data: {
      id: "comment-1",
      content: "Ini komentar utama",
      user_id: "user-3",
      article_id: "article-1",
    },
  });
  if (comments) {
    await db.comment.create({
      data: {
        id: "comment-2",
        content: "Ini balasan komentar",
        user_id: "user-3",
        article_id: "article-1",
        parent_id: comments.id,
      },
    });
  }

  if (articles) {
    await db.like.createMany({
      data: [
        { id: "like-1", user_id: "user-3", article_id: "article-1" },
        { id: "like-2", user_id: "user-4", article_id: "article-1" },
      ],
    });
  }

  console.log(" ✅ Database has been seeded ", {
    users,
    categories,
    articles,
    comments,
  });
}

main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.log(e);
    await db.$disconnect();
    process.exit(1);
  });
