export const listChatSelect = {
  id: true,
  name: true,
  messages: {
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      value: true,
      userToChat: {
        select: {
          nickname: true,
          user: { select: { name: true, email: true } }
        }
      }
    },
    orderBy: { updatedAt: "desc" },
    take: 1
  }
};
