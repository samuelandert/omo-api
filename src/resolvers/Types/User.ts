import { Context } from "../../utils/Utils";

export const User = {
  claims: async ({ id }: any, _args: any, context: Context) => {
    return getUserClaims(id, context);
  },
  roles: ({ id }: any, _args: any, context: Context) => {
    return context.prisma.user({ id }).roles();
  },
  city: ({ id }: any, _args: any, context: Context) => {
    return context.prisma.user({ id }).city();
  }
};

export async function getUserClaims(id: string, context: Context) {
  const userClaims: Array<string> = [];

  const roles = await context.prisma.user({ id }).roles();
  for (var role of roles) {
    var roleClaims = await context.prisma.role({ id: role.id }).claims();
    for (var claim of roleClaims) {
      if (!userClaims.includes(claim.name)) userClaims.push(claim.name);
    }
  }
  return userClaims;
}
