import { Context } from "../../definitions/Interfaces";

export const City = {
  votes: async ({ id }: any, _args: any, ctx: Context) => {
    let balances = await ctx.prisma
      .city({ id: id })
      .wallet()
      .balances({ where: { asset: { name: "CITYVOTES" } } });
    return balances.length > 0 ? balances[0].value : 0;
  },
  wallet: ({ id }: any, _args: any, ctx: Context) =>
    ctx.prisma.city({ id: id }).wallet()
};
