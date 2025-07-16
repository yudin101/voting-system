beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => { });
});

afterAll(()=>{
  jest.restoreAllMocks()
})
