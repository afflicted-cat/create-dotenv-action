const coreMock = require("@actions/core");
const { vol } = require("memfs");

const { createDotenv } = require("../create-dotenv");

jest.mock("fs", () => require("memfs").fs);

jest.mock("@actions/core", () => ({
  setFailed: jest.fn(),
  getInput: jest.fn().mockImplementation((name) => name),
}));

/*eslint-disable padding-line-between-statements*/

describe("createDotenv", () => {
  beforeEach(() => {
    process.env.GITHUB_WORKSPACE = "/";
  });

  afterEach(() => {
    vol.reset();
    delete process.env.GITHUB_WORKSPACE;
  });

  it("should create env file using path from GITHUB_WORKSPACE", () => {
    const path = "/some/path";
    process.env.GITHUB_WORKSPACE = path;
    vol.mkdirSync(path, { recursive: true });

    createDotenv();

    expect(Object.keys(vol.toJSON()).length).toBe(1);
    expect(Object.keys(vol.toJSON())[0]).toContain(path);
  });

  it("should create env file with the name obtained from the 'filename'", () => {
    const filename = ".env.test";
    coreMock.getInput.mockImplementation(() => filename);

    createDotenv();

    expect(Object.keys(vol.toJSON())[0]).toContain(filename);
  });

  it("should call setFailed with message if the file being created already exists", () => {
    const path = "/path";
    const filename = ".env";
    const filePath = `${path}/${filename}`;
    process.env.GITHUB_WORKSPACE = path;
    coreMock.getInput.mockImplementation(() => filename);
    vol.fromJSON({ [filePath]: "" });

    createDotenv();

    expect(coreMock.setFailed).toBeCalledWith(expect.any(String));
  });

  it("should create file with env variables filtred by 'wildecard'", () => {
    const wildecard = "*";
    const valueOne = "value_one";
    const valueTwo = "value_two";
    const keyOne = `${wildecard}TEST_ONE`;
    const keyTwo = `${wildecard}TEST_TWO`;
    process.env[keyOne] = valueOne;
    process.env[keyTwo] = valueTwo;
    coreMock.getInput.mockImplementation(() => wildecard);

    createDotenv();

    expect(Object.values(vol.toJSON())[0]).toContain(`TEST_ONE=${valueOne}`);
    expect(Object.values(vol.toJSON())[0]).toContain(`TEST_TWO=${valueTwo}`);

    delete process.env[keyOne];
    delete process.env[keyTwo];
  });

  it("shoul ignore env who do not have a 'wildecard'", () => {
    const wildecard = "+";
    const valueOne = "value_one";
    const valueTwo = "value_two";
    process.env.TEST_ONE = valueOne;
    process.env.TEST_TWO = valueTwo;
    coreMock.getInput.mockImplementation(() => wildecard);

    createDotenv();

    expect(Object.values(vol.toJSON())[0]).not.toContain(valueOne);
    expect(Object.values(vol.toJSON())[0]).not.toContain(valueTwo);

    delete process.env.TEST_ONE;
    delete process.env.TEST_TWO;
  });

  it("shoul split variables in file", () => {
    const wildecard = "*";
    const valueOne = "value_one";
    const valueTwo = "value_two";
    const keyOne = `${wildecard}TEST_ONE`;
    const keyTwo = `${wildecard}TEST_TWO`;
    process.env[keyOne] = valueOne;
    process.env[keyTwo] = valueTwo;
    coreMock.getInput.mockImplementation(() => wildecard);

    createDotenv();

    expect(Object.values(vol.toJSON())[0]).toContain(`${valueOne}\n`);

    delete process.env[keyOne];
    delete process.env[keyTwo];
  });

  it("should log steps 2 times if success", () => {
    const consoleSpy = jest.spyOn(console, "log");

    createDotenv();

    expect(consoleSpy).toBeCalledTimes(2);
  });

  it("should log steps 1 times if cant create file", () => {
    const path = "/path";
    const filename = ".env";
    const filePath = `${path}/${filename}`;
    const consoleSpy = jest.spyOn(console, "log");
    coreMock.getInput.mockImplementation(() => filename);
    process.env.GITHUB_WORKSPACE = path;
    vol.fromJSON({ [filePath]: "" });

    createDotenv();

    expect(consoleSpy).toBeCalledTimes(1);
  });
});
