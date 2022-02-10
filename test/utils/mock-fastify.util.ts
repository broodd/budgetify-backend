export function createRepMock(mimetype?: string): any {
  return {
    type: function (data: string) {
      expect(data).toEqual(mimetype);
      return this;
    },
    send: async function () {
      return this;
    },
  };
}
