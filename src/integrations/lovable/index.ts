export const lovable = {
  auth: {
    signInWithOAuth: async () => {
      return {
        error: new Error(
          "OAuth is disabled. Please use manual email and password authentication.",
        ),
      };
    },
  },
};
