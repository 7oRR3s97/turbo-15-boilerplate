// import { db } from '@packages/db';

// export const POST = async () => {
//   const newPage = await db.page.create({
//     data: {
//       name: 'cron-temp',
//       email: 'test@test.com',
//     },
//   });

//   await db.page.delete({
//     where: {
//       id: newPage.id,
//     },
//   });

//   return new Response('OK', { status: 200 });
// };
