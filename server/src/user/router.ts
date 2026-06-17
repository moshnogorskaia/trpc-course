import { z } from 'zod';
import { router, publicProcedure } from '@trpc/server';
import { users } from './db';
import { type User } from './types';

export const userRouter = router({
  getUsers: publicProcedure.query(() => users),
  getUserById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req: { input: string }) => {
      const { input } = req;

      const user: User | undefined = users.find((user) => user.id === input);

      return user;
    }),
    createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation((req: { input: { name: string } }) => {
      const { input } = req;

      const user: User = {
        id: `${Math.random()}`,
        name: input.name,
      };

      users.push(user);

      return user;
    }),
});
